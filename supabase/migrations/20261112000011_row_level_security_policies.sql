-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 11: ROW LEVEL SECURITY (RLS) & TENANT ISOLATION
-- ==============================================================================

-- 1. HELPER SECURITY FUNCTIONS

-- Check if user is platform super admin
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM platform_admins WHERE user_id = auth.uid()
  );
$$;

-- Get list of organizations the authenticated user belongs to
CREATE OR REPLACE FUNCTION get_user_org_ids()
RETURNS TABLE (org_id UUID)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT organization_id FROM organization_memberships
  WHERE user_id = auth.uid() AND is_active = TRUE;
$$;

-- Get the role of the user within a specific organization
CREATE OR REPLACE FUNCTION get_org_user_role(p_org_id UUID)
RETURNS VARCHAR
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM organization_memberships
  WHERE user_id = auth.uid() AND organization_id = p_org_id AND is_active = TRUE
  LIMIT 1;
$$;

-- Get the employee ID of the authenticated user in a specific organization
CREATE OR REPLACE FUNCTION get_my_employee_id(p_org_id UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT id FROM employees
  WHERE user_id = auth.uid() AND organization_id = p_org_id
  LIMIT 1;
$$;

-- 2. ENABLE RLS ON ALL TABLES
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_salary_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payslips ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE timesheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE remote_config_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. ORGANIZATIONS POLICIES
CREATE POLICY org_select_policy ON organizations
    FOR SELECT
    USING (
        is_platform_admin() OR 
        id IN (SELECT get_user_org_ids())
    );

CREATE POLICY org_update_policy ON organizations
    FOR UPDATE
    USING (
        is_platform_admin() OR 
        get_org_user_role(id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN')
    );

-- 4. EMPLOYEES POLICIES
CREATE POLICY employee_select_policy ON employees
    FOR SELECT
    USING (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND 
            (
                -- Self access
                user_id = auth.uid() OR
                -- Admin access
                get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'HR_ADMIN') OR
                -- Manager access
                reporting_manager_id = get_my_employee_id(organization_id)
            )
        )
    );

CREATE POLICY employee_insert_policy ON employees
    FOR INSERT
    WITH CHECK (
        is_platform_admin() OR 
        get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'HR_ADMIN')
    );

CREATE POLICY employee_update_policy ON employees
    FOR UPDATE
    USING (
        is_platform_admin() OR 
        get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'HR_ADMIN')
    );

-- 5. ATTENDANCE POLICIES
CREATE POLICY attendance_select_policy ON attendance_records
    FOR SELECT
    USING (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND
            (
                employee_id = get_my_employee_id(organization_id) OR
                get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'HR_ADMIN', 'BRANCH_MANAGER', 'DEPARTMENT_HEAD', 'TEAM_LEAD')
            )
        )
    );

CREATE POLICY attendance_insert_policy ON attendance_records
    FOR INSERT
    WITH CHECK (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND
            employee_id = get_my_employee_id(organization_id)
        )
    );

-- 6. LEAVE POLICIES
CREATE POLICY leave_select_policy ON leave_requests
    FOR SELECT
    USING (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND
            (
                employee_id = get_my_employee_id(organization_id) OR
                get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'HR_ADMIN', 'BRANCH_MANAGER', 'DEPARTMENT_HEAD', 'TEAM_LEAD')
            )
        )
    );

CREATE POLICY leave_insert_policy ON leave_requests
    FOR INSERT
    WITH CHECK (
        organization_id IN (SELECT get_user_org_ids()) AND
        employee_id = get_my_employee_id(organization_id)
    );

-- 7. PAYROLL & PAYSLIP POLICIES (STRICT CONFIDENTIALITY GUARD)
CREATE POLICY payslips_select_policy ON payslips
    FOR SELECT
    USING (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND
            (
                -- Employee can ONLY view their OWN payslip
                employee_id = get_my_employee_id(organization_id) OR
                -- Authorized payroll officers
                get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'FINANCE_ADMIN')
            )
        )
    );

CREATE POLICY payroll_runs_select_policy ON payroll_runs
    FOR SELECT
    USING (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND
            get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'FINANCE_ADMIN', 'HR_ADMIN')
        )
    );

-- 8. TASKS POLICIES
CREATE POLICY tasks_select_policy ON tasks
    FOR SELECT
    USING (
        is_platform_admin() OR 
        (
            organization_id IN (SELECT get_user_org_ids()) AND
            (
                assigned_to_employee_id = get_my_employee_id(organization_id) OR
                created_by_id = auth.uid() OR
                get_org_user_role(organization_id) IN ('COMPANY_OWNER', 'COMPANY_ADMIN', 'DEPARTMENT_HEAD', 'TEAM_LEAD')
            )
        )
    );

-- 9. NOTIFICATIONS POLICIES
CREATE POLICY notifications_select_policy ON notifications
    FOR SELECT
    USING (recipient_user_id = auth.uid());

CREATE POLICY notifications_update_policy ON notifications
    FOR UPDATE
    USING (recipient_user_id = auth.uid());
