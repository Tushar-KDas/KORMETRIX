-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 02: EMPLOYEES, BRANCHES & DEPARTMENTS
-- ==============================================================================

-- 1. ORGANIZATION BRANCHES & GEOFENCES
CREATE TABLE IF NOT EXISTS organization_branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    code VARCHAR(20) NOT NULL,
    is_headquarters BOOLEAN NOT NULL DEFAULT FALSE,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL DEFAULT 'Dhaka',
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    radius_meters INT NOT NULL DEFAULT 150, -- Geofence radius in meters
    contact_phone VARCHAR(30),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_branch_code UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_branches_org ON organization_branches(organization_id);

-- 2. DEPARTMENTS
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES organization_branches(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    code VARCHAR(20) NOT NULL,
    head_employee_id UUID, -- Foreign key added after employees table
    budget_bdt NUMERIC(15, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_dept_code UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_departments_org ON departments(organization_id);

-- 3. DESIGNATIONS
CREATE TABLE IF NOT EXISTS designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    title VARCHAR(100) NOT NULL,
    title_bn VARCHAR(100),
    level INT NOT NULL DEFAULT 1,
    min_salary_bdt NUMERIC(12, 2) DEFAULT 0,
    max_salary_bdt NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_designations_org ON designations(organization_id);

-- 4. EMPLOYEES
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    employee_code VARCHAR(30) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_bn VARCHAR(100),
    last_name_bn VARCHAR(100),
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    gender VARCHAR(10) NOT NULL DEFAULT 'MALE',
    date_of_birth DATE,
    joining_date DATE NOT NULL,
    confirmation_date DATE,
    employment_type VARCHAR(30) NOT NULL DEFAULT 'FULL_TIME',
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- 'PROBATION', 'ACTIVE', 'SUSPENDED', 'ON_LEAVE', 'RESIGNED', 'TERMINATED'
    branch_id UUID NOT NULL REFERENCES organization_branches(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    designation_id UUID NOT NULL REFERENCES designations(id),
    reporting_manager_id UUID REFERENCES employees(id),
    shift_id UUID, -- Linked to shifts table in migration 03
    photo_url TEXT,
    nid_number VARCHAR(50),
    blood_group VARCHAR(10),
    present_address TEXT,
    permanent_address TEXT,
    basic_salary_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    gross_salary_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    bank_name VARCHAR(100),
    bank_account_number VARCHAR(50),
    routing_number VARCHAR(30),
    bkash_number VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_emp_code UNIQUE (organization_id, employee_code)
);

-- Backlink department head
ALTER TABLE departments 
ADD CONSTRAINT fk_departments_head 
FOREIGN KEY (head_employee_id) REFERENCES employees(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_employees_org ON employees(organization_id);
CREATE INDEX IF NOT EXISTS idx_employees_user ON employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_dept ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_branch ON employees(branch_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(reporting_manager_id);

-- 5. EMPLOYEE EMERGENCY CONTACTS
CREATE TABLE IF NOT EXISTS employee_emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    address TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. EMPLOYEE EDUCATIONS & EXPERIENCES
CREATE TABLE IF NOT EXISTS employee_educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    degree VARCHAR(100) NOT NULL,
    institution VARCHAR(150) NOT NULL,
    passing_year INT NOT NULL,
    result_or_gpa VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employee_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    company_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    responsibilities TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
