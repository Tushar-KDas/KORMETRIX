-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 06: WORKFORCE, TASKS & PERFORMANCE MANAGEMENT
-- ==============================================================================

-- 1. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    code VARCHAR(30) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- 'PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'
    progress_percentage INT NOT NULL DEFAULT 0,
    budget_bdt NUMERIC(15, 2) DEFAULT 0,
    manager_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_project_code UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(organization_id);

-- 2. PROJECT MEMBERS
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    project_role VARCHAR(50) NOT NULL DEFAULT 'CONTRIBUTOR', -- 'LEAD', 'CONTRIBUTOR', 'REVIEWER'
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_project_employee UNIQUE (project_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_proj_members_proj ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_proj_members_emp ON project_members(employee_id);

-- 3. TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to_employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    created_by_id UUID NOT NULL REFERENCES profiles(id),
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    status VARCHAR(30) NOT NULL DEFAULT 'TODO',     -- 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'BLOCKED'
    deadline TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    estimated_hours NUMERIC(6, 2) DEFAULT 0,
    actual_hours NUMERIC(6, 2) DEFAULT 0,
    progress_percentage INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_org ON tasks(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_emp ON tasks(assigned_to_employee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- 4. TASK CHECKLISTS & COMMENTS
CREATE TABLE IF NOT EXISTS task_checklists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_comments_task ON task_comments(task_id);

-- 5. TIMESHEETS
CREATE TABLE IF NOT EXISTS timesheets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    work_date DATE NOT NULL,
    duration_minutes INT NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'
    approved_by UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timesheets_emp ON timesheets(employee_id);

-- 6. PERFORMANCE GOALS & OKRS
CREATE TABLE IF NOT EXISTS employee_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    target_value NUMERIC(10, 2) NOT NULL DEFAULT 100,
    current_value NUMERIC(10, 2) NOT NULL DEFAULT 0,
    metric_unit VARCHAR(30) NOT NULL DEFAULT '%',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS', -- 'IN_PROGRESS', 'ACHIEVED', 'PARTIALLY_ACHIEVED', 'MISSED'
    weightage_percentage NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_goals_emp ON employee_goals(employee_id);

-- 7. PERFORMANCE REVIEWS & APPRAISALS
CREATE TABLE IF NOT EXISTS performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    reviewer_employee_id UUID NOT NULL REFERENCES employees(id),
    review_cycle VARCHAR(100) NOT NULL, -- e.g. "Annual Appraisal 2024-2025"
    self_rating NUMERIC(3, 2),          -- 1.00 to 5.00
    self_comments TEXT,
    manager_rating NUMERIC(3, 2),        -- 1.00 to 5.00
    manager_comments TEXT,
    final_score NUMERIC(3, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SELF_SUBMITTED', 'MANAGER_REVIEWED', 'COMPLETED'
    promotion_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    salary_revision_percentage NUMERIC(5, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_emp ON performance_reviews(employee_id);
