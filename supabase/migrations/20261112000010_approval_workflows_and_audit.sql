-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 10: UNIVERSAL APPROVAL WORKFLOWS & AUDIT LOGGING
-- ==============================================================================

-- 1. APPROVAL WORKFLOWS
CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    module_type VARCHAR(40) NOT NULL, -- 'LEAVE', 'ATTENDANCE_CORRECTION', 'EXPENSE', 'SALARY_ADVANCE', 'PAYROLL_FINALIZATION'
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_workflow_module UNIQUE (organization_id, module_type)
);

CREATE TABLE IF NOT EXISTS approval_workflow_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_order INT NOT NULL, -- 1, 2, 3...
    name VARCHAR(100) NOT NULL,
    approver_type VARCHAR(30) NOT NULL, -- 'REPORTING_MANAGER', 'DEPARTMENT_HEAD', 'BRANCH_MANAGER', 'HR_ADMIN', 'FINANCE_ADMIN', 'SPECIFIC_USER'
    specific_user_id UUID REFERENCES profiles(id),
    min_amount_bdt NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_workflow_step UNIQUE (workflow_id, step_order)
);

CREATE TABLE IF NOT EXISTS approval_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workflow_id UUID NOT NULL REFERENCES approval_workflows(id) ON DELETE CASCADE,
    resource_type VARCHAR(40) NOT NULL,
    resource_id UUID NOT NULL,
    requester_employee_id UUID NOT NULL REFERENCES employees(id),
    current_step_order INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_inst_resource ON approval_instances(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_approval_inst_org ON approval_instances(organization_id);

CREATE TABLE IF NOT EXISTS approval_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID NOT NULL REFERENCES approval_instances(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    actor_user_id UUID NOT NULL REFERENCES profiles(id),
    action VARCHAR(30) NOT NULL, -- 'APPROVE', 'REJECT', 'REQUEST_CHANGES', 'CANCEL'
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ENTERPRISE AUDIT LOGS (IMMUTABLE FORENSIC TRAIL)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    actor_user_id UUID NOT NULL REFERENCES profiles(id),
    actor_email VARCHAR(150),
    action VARCHAR(60) NOT NULL, -- e.g. "AUTH_LOGIN", "PAYROLL_LOCKED", "LEAVE_APPROVED", "CONFIG_PUBLISHED"
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    before_snapshot JSONB,
    after_snapshot JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_org_time ON audit_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- 3. SECURITY EVENTS (THREAT DETECTION & SUSPICIOUS ACTIVITY)
CREATE TABLE IF NOT EXISTS security_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'SUSPICIOUS_LOGIN', 'RATE_LIMIT_EXCEEDED', 'UNAUTHORIZED_ACCESS_ATTEMPT', 'MFA_FAILED'
    severity VARCHAR(20) NOT NULL DEFAULT 'WARNING', -- 'INFO', 'WARNING', 'CRITICAL'
    ip_address VARCHAR(50),
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_security_events_time ON security_events(created_at DESC);
