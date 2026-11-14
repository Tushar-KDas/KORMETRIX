-- WORKFORCE 360 COMPLETE ALL-IN-ONE SUPABASE SCHEMA & DATABASE SETUP

-- ==============================================================================
-- FILE: 20261112000001_core_organizations_and_identity.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 01: CORE ORGANIZATIONS, IDENTITY & SUBSCRIPTIONS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(30) NOT NULL UNIQUE, -- 'FREE', 'STARTER', 'PROFESSIONAL', 'BUSINESS', 'ENTERPRISE'
    monthly_price_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    annual_price_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    max_employees INT NOT NULL DEFAULT 10,
    max_branches INT NOT NULL DEFAULT 1,
    max_storage_gb INT NOT NULL DEFAULT 5,
    custom_branding BOOLEAN NOT NULL DEFAULT FALSE,
    advanced_reports BOOLEAN NOT NULL DEFAULT FALSE,
    audit_logs BOOLEAN NOT NULL DEFAULT FALSE,
    api_access BOOLEAN NOT NULL DEFAULT FALSE,
    support_tier VARCHAR(20) NOT NULL DEFAULT 'STANDARD', -- 'STANDARD', 'PRIORITY', 'DEDICATED'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. ORGANIZATIONS (TENANTS)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    name_bn VARCHAR(150),
    slug VARCHAR(60) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    logo_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE', -- 'TRIAL', 'ACTIVE', 'SUSPENDED', 'EXPIRED'
    subscription_plan_id UUID REFERENCES subscription_plans(id) ON DELETE SET NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'BDT',
    currency_symbol VARCHAR(5) NOT NULL DEFAULT '৳',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Dhaka',
    fiscal_year_start_month INT NOT NULL DEFAULT 7, -- Bangladesh Fiscal Year July-June
    country VARCHAR(50) NOT NULL DEFAULT 'Bangladesh',
    address TEXT,
    phone VARCHAR(30),
    email VARCHAR(100),
    website VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON organizations(status);

-- 3. ORGANIZATION SETTINGS
CREATE TABLE IF NOT EXISTS organization_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL UNIQUE REFERENCES organizations(id) ON DELETE CASCADE,
    require_geofence_attendance BOOLEAN NOT NULL DEFAULT TRUE,
    allow_qr_attendance BOOLEAN NOT NULL DEFAULT TRUE,
    allow_manual_web_punch BOOLEAN NOT NULL DEFAULT FALSE,
    allow_offline_mobile_punch BOOLEAN NOT NULL DEFAULT TRUE,
    work_week_start_day INT NOT NULL DEFAULT 0, -- Sunday = 0
    weekend_days INT[] NOT NULL DEFAULT '{5, 6}', -- 5 = Friday, 6 = Saturday in Bangladesh
    standard_daily_work_minutes INT NOT NULL DEFAULT 480, -- 8 Hours
    overtime_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY, -- references auth.users(id)
    email VARCHAR(150) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    full_name_bn VARCHAR(150),
    phone VARCHAR(30),
    avatar_url TEXT,
    is_platform_admin BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'bn', -- 'bn' or 'en'
    preferred_theme VARCHAR(10) NOT NULL DEFAULT 'light',  -- 'light' or 'dark'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PLATFORM ADMINS
CREATE TABLE IF NOT EXISTS platform_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'SUPER_ADMIN', -- 'SUPER_ADMIN', 'SUPPORT_STAFF', 'BILLING_MANAGER'
    granted_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ORGANIZATION MEMBERSHIPS & ROLES
CREATE TABLE IF NOT EXISTS organization_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(40) NOT NULL DEFAULT 'EMPLOYEE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    branch_scope UUID[] DEFAULT '{}',
    department_scope UUID[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_organization UNIQUE (user_id, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_user ON organization_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_org ON organization_memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_role ON organization_memberships(role);

-- 7. USER INVITATIONS
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL,
    role VARCHAR(40) NOT NULL DEFAULT 'EMPLOYEE',
    token VARCHAR(100) NOT NULL UNIQUE,
    invited_by UUID NOT NULL REFERENCES profiles(id),
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);

-- 8. REGISTERED DEVICES (For mobile authentication & device binding)
CREATE TABLE IF NOT EXISTS registered_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    device_id VARCHAR(100) NOT NULL,
    device_name VARCHAR(100),
    device_os VARCHAR(30), -- 'ANDROID', 'IOS'
    os_version VARCHAR(30),
    app_version VARCHAR(30),
    fcm_push_token TEXT,
    is_trusted BOOLEAN NOT NULL DEFAULT TRUE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_device UNIQUE (user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_devices_user ON registered_devices(user_id);


-- ==============================================================================
-- FILE: 20261112000002_employees_and_departments.sql
-- ==============================================================================
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


-- ==============================================================================
-- FILE: 20261112000003_attendance_and_shifts.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 03: ATTENDANCE, SHIFTS & GEOFENCING
-- ==============================================================================

-- 1. SHIFTS
CREATE TABLE IF NOT EXISTS shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    code VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL, -- e.g. '09:00:00'
    end_time TIME NOT NULL,   -- e.g. '18:00:00'
    grace_period_minutes INT NOT NULL DEFAULT 15,
    half_day_minimum_minutes INT NOT NULL DEFAULT 240, -- 4 Hours
    full_day_minimum_minutes INT NOT NULL DEFAULT 480, -- 8 Hours
    is_night_shift BOOLEAN NOT NULL DEFAULT FALSE,
    weekly_off_days INT[] NOT NULL DEFAULT '{5, 6}', -- 5 = Friday, 6 = Saturday in Bangladesh
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backlink employee shift
ALTER TABLE employees
ADD CONSTRAINT fk_employees_shift
FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_shifts_org ON shifts(organization_id);

-- 2. PUBLIC & COMPANY HOLIDAYS
CREATE TABLE IF NOT EXISTS holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    title_bn VARCHAR(150),
    holiday_date DATE NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_holiday_date UNIQUE (organization_id, holiday_date)
);

CREATE INDEX IF NOT EXISTS idx_holidays_org_date ON holidays(organization_id, holiday_date);

-- 3. RAW ATTENDANCE EVENTS (IMMUTABLE AUDIT TRAIL)
CREATE TABLE IF NOT EXISTS attendance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    event_type VARCHAR(20) NOT NULL, -- 'CHECK_IN', 'CHECK_OUT', 'BREAK_START', 'BREAK_END'
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_method VARCHAR(30) NOT NULL DEFAULT 'GPS_GEOFENCE', -- 'GPS_GEOFENCE', 'QR_CODE', 'MANUAL_WEB', 'BIOMETRIC_DEVICE', 'OFFLINE_SYNC'
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    accuracy_meters NUMERIC(6, 2),
    is_within_geofence BOOLEAN NOT NULL DEFAULT TRUE,
    device_id VARCHAR(100),
    ip_address VARCHAR(50),
    idempotency_key UUID NOT NULL UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_emp_time ON attendance_events(employee_id, event_timestamp);
CREATE INDEX IF NOT EXISTS idx_events_org ON attendance_events(organization_id);

-- 4. ATTENDANCE DAILY RECORDS (DERIVED SUMMARY)
CREATE TABLE IF NOT EXISTS attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT', -- 'PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'ON_LEAVE', 'HOLIDAY', 'WEEKLY_OFF'
    working_minutes INT NOT NULL DEFAULT 0,
    break_minutes INT NOT NULL DEFAULT 0,
    overtime_minutes INT NOT NULL DEFAULT 0,
    late_minutes INT NOT NULL DEFAULT 0,
    early_departure_minutes INT NOT NULL DEFAULT 0,
    check_in_method VARCHAR(30) DEFAULT 'GPS_GEOFENCE',
    check_out_method VARCHAR(30),
    check_in_latitude NUMERIC(10, 7),
    check_in_longitude NUMERIC(10, 7),
    is_within_geofence BOOLEAN NOT NULL DEFAULT TRUE,
    is_offline_synced BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_emp_attendance_date UNIQUE (employee_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_records_org_date ON attendance_records(organization_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_records_emp ON attendance_records(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_records_status ON attendance_records(status);

-- 5. ATTENDANCE ADJUSTMENT / CORRECTION REQUESTS
CREATE TABLE IF NOT EXISTS attendance_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_record_id UUID REFERENCES attendance_records(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    requested_check_in TIMESTAMPTZ NOT NULL,
    requested_check_out TIMESTAMPTZ NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
    approved_by UUID REFERENCES employees(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attendance_adj_org ON attendance_adjustments(organization_id);
CREATE INDEX IF NOT EXISTS idx_attendance_adj_emp ON attendance_adjustments(employee_id);


-- ==============================================================================
-- FILE: 20261112000004_leave_and_ledger.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 04: LEAVE MANAGEMENT & LEDGER
-- ==============================================================================

-- 1. LEAVE TYPES
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100) NOT NULL,
    code VARCHAR(30) NOT NULL, -- 'ANNUAL', 'CASUAL', 'SICK', 'MATERNITY', 'PATERNITY', 'SPECIAL', 'UNPAID'
    annual_allocation_days NUMERIC(4, 1) NOT NULL DEFAULT 14,
    carry_forward_max_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    is_encashable BOOLEAN NOT NULL DEFAULT FALSE,
    requires_attachment BOOLEAN NOT NULL DEFAULT FALSE,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_leave_type_code UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_leave_types_org ON leave_types(organization_id);

-- 2. LEAVE BALANCES
CREATE TABLE IF NOT EXISTS leave_balances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL, -- e.g. 2025
    allocated_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    used_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    pending_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    carried_over_days NUMERIC(4, 1) NOT NULL DEFAULT 0,
    remaining_days NUMERIC(4, 1) GENERATED ALWAYS AS (allocated_days + carried_over_days - used_days) STORED,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_emp_leave_year UNIQUE (employee_id, leave_type_id, fiscal_year)
);

CREATE INDEX IF NOT EXISTS idx_leave_balances_emp ON leave_balances(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_org_year ON leave_balances(organization_id, fiscal_year);

-- 3. LEAVE REQUESTS
CREATE TABLE IF NOT EXISTS leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days NUMERIC(4, 1) NOT NULL,
    reason TEXT NOT NULL,
    attachment_url TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'APPROVED_STAGE_1', 'APPROVED', 'REJECTED', 'CANCELLED'
    current_step_order INT NOT NULL DEFAULT 1,
    approved_by UUID REFERENCES employees(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leave_requests_org ON leave_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_emp ON leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON leave_requests(status);

-- 4. LEAVE TRANSACTIONS (IMMUTABLE LEDGER)
CREATE TABLE IF NOT EXISTS leave_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    leave_request_id UUID REFERENCES leave_requests(id) ON DELETE SET NULL,
    transaction_type VARCHAR(30) NOT NULL, -- 'ANNUAL_ALLOCATION', 'LEAVE_DEDUCTION', 'LEAVE_CANCELLATION_REFUND', 'CARRY_FORWARD', 'ENCASHMENT'
    days NUMERIC(4, 1) NOT NULL,
    balance_after NUMERIC(4, 1) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leave_transactions_emp ON leave_transactions(employee_id);


-- ==============================================================================
-- FILE: 20261112000005_payroll_and_tax_bangladesh.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 05: PAYROLL, SALARY & BANGLADESH TAX RULES
-- ==============================================================================

-- 1. SALARY COMPONENTS
CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    code VARCHAR(30) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'EARNING' or 'DEDUCTION'
    is_taxable BOOLEAN NOT NULL DEFAULT TRUE,
    is_statutory BOOLEAN NOT NULL DEFAULT FALSE,
    calculation_type VARCHAR(20) NOT NULL DEFAULT 'FIXED', -- 'FIXED', 'PERCENTAGE_OF_BASIC', 'PERCENTAGE_OF_GROSS'
    default_percentage NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_comp_code UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_components_org ON salary_components(organization_id);

-- 2. SALARY STRUCTURES
CREATE TABLE IF NOT EXISTS salary_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    basic_percentage NUMERIC(5, 2) NOT NULL DEFAULT 50.00,
    house_rent_percentage NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    medical_percentage NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
    conveyance_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. EMPLOYEE SALARY ASSIGNMENTS
CREATE TABLE IF NOT EXISTS employee_salary_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    structure_id UUID REFERENCES salary_structures(id),
    gross_salary_bdt NUMERIC(12, 2) NOT NULL,
    basic_salary_bdt NUMERIC(12, 2) NOT NULL,
    house_rent_bdt NUMERIC(12, 2) NOT NULL,
    medical_allowance_bdt NUMERIC(12, 2) NOT NULL,
    conveyance_allowance_bdt NUMERIC(12, 2) NOT NULL,
    provident_fund_employee_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    provident_fund_employer_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    effective_from DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_salary_assign_emp ON employee_salary_assignments(employee_id);

-- 4. BANGLADESH TAX RULE VERSIONS (EFFECTIVE DATE BASED)
CREATE TABLE IF NOT EXISTS tax_rule_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = national default
    title VARCHAR(150) NOT NULL, -- e.g. "Bangladesh Finance Act 2024-2025"
    effective_from DATE NOT NULL,
    effective_to DATE,
    general_exemption_limit_bdt NUMERIC(12, 2) NOT NULL DEFAULT 350000,
    female_exemption_limit_bdt NUMERIC(12, 2) NOT NULL DEFAULT 400000,
    senior_exemption_limit_bdt NUMERIC(12, 2) NOT NULL DEFAULT 400000,
    disabled_exemption_limit_bdt NUMERIC(12, 2) NOT NULL DEFAULT 475000,
    tax_slabs JSONB NOT NULL DEFAULT '[
      {"limit": 100000, "rate": 5},
      {"limit": 400000, "rate": 10},
      {"limit": 500000, "rate": 15},
      {"limit": 500000, "rate": 20},
      {"limit": 999999999, "rate": 25}
    ]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PAYROLL PERIODS
CREATE TABLE IF NOT EXISTS payroll_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- e.g. "April 2025"
    month INT NOT NULL, -- 1 to 12
    year INT NOT NULL,  -- e.g. 2025
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    working_days INT NOT NULL DEFAULT 22,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_period UNIQUE (organization_id, month, year)
);

CREATE INDEX IF NOT EXISTS idx_payroll_periods_org ON payroll_periods(organization_id);

-- 6. PAYROLL RUNS (BATCH HEADERS)
CREATE TABLE IF NOT EXISTS payroll_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    period_id UUID NOT NULL REFERENCES payroll_periods(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'PREVIEW_GENERATED', 'PENDING_APPROVAL', 'APPROVED', 'LOCKED', 'PAID'
    total_gross_salary_bdt NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_allowances_bdt NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_deductions_bdt NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_tax_bdt NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_net_payable_bdt NUMERIC(15, 2) NOT NULL DEFAULT 0,
    total_employees_processed INT NOT NULL DEFAULT 0,
    finalized_by UUID REFERENCES profiles(id),
    finalized_at TIMESTAMPTZ,
    locked_at TIMESTAMPTZ,
    payment_method VARCHAR(30), -- 'BANK_TRANSFER', 'BKASH', 'CASH'
    payment_reference VARCHAR(100),
    disbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payroll_runs_org ON payroll_runs(organization_id);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_period ON payroll_runs(period_id);
CREATE INDEX IF NOT EXISTS idx_payroll_runs_status ON payroll_runs(status);

-- 7. PAYROLL RUN ITEMS / PAYSLIPS (IMMUTABLE CALCULATION SNAPSHOT)
CREATE TABLE IF NOT EXISTS payslips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payroll_run_id UUID NOT NULL REFERENCES payroll_runs(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    basic_salary_bdt NUMERIC(12, 2) NOT NULL,
    house_rent_bdt NUMERIC(12, 2) NOT NULL,
    medical_allowance_bdt NUMERIC(12, 2) NOT NULL,
    conveyance_allowance_bdt NUMERIC(12, 2) NOT NULL,
    festival_bonus_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    performance_bonus_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    overtime_hours NUMERIC(6, 2) NOT NULL DEFAULT 0,
    overtime_pay_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    gross_earnings_bdt NUMERIC(12, 2) NOT NULL,
    tax_deduction_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    provident_fund_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    loan_installment_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    unpaid_leave_deduction_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_deductions_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    net_payable_bdt NUMERIC(12, 2) NOT NULL,
    payment_status VARCHAR(20) NOT NULL DEFAULT 'UNPAID', -- 'UNPAID', 'PAID'
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    routing_number VARCHAR(30),
    bkash_number VARCHAR(20),
    generated_pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_run_employee_payslip UNIQUE (payroll_run_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_payslips_run ON payslips(payroll_run_id);
CREATE INDEX IF NOT EXISTS idx_payslips_emp ON payslips(employee_id);
CREATE INDEX IF NOT EXISTS idx_payslips_org ON payslips(organization_id);

-- 8. EMPLOYEE LOANS & SALARY ADVANCES
CREATE TABLE IF NOT EXISTS employee_loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    loan_amount_bdt NUMERIC(12, 2) NOT NULL,
    monthly_installment_bdt NUMERIC(12, 2) NOT NULL,
    total_installments INT NOT NULL,
    paid_installments INT NOT NULL DEFAULT 0,
    remaining_balance_bdt NUMERIC(12, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'PENDING', 'ACTIVE', 'PAID_OFF', 'REJECTED'
    approved_by UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_emp ON employee_loans(employee_id);


-- ==============================================================================
-- FILE: 20261112000006_workforce_tasks_and_performance.sql
-- ==============================================================================
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


-- ==============================================================================
-- FILE: 20261112000007_finance_assets_and_documents.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 07: FINANCE, ASSETS & DOCUMENT MANAGEMENT
-- ==============================================================================

-- 1. EXPENSE CATEGORIES
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    name_bn VARCHAR(100),
    code VARCHAR(30) NOT NULL,
    max_limit_bdt NUMERIC(12, 2),
    requires_receipt BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. EXPENSE CLAIMS & ITEMS
CREATE TABLE IF NOT EXISTS expense_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    claim_date DATE NOT NULL,
    total_amount_bdt NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED', -- 'DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'REIMBURSED'
    approved_by UUID REFERENCES employees(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    reimbursed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expense_claims_org ON expense_claims(organization_id);
CREATE INDEX IF NOT EXISTS idx_expense_claims_emp ON expense_claims(employee_id);

CREATE TABLE IF NOT EXISTS expense_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES expense_claims(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES expense_categories(id),
    description TEXT NOT NULL,
    amount_bdt NUMERIC(12, 2) NOT NULL,
    receipt_url TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ASSET MANAGEMENT
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    asset_tag VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'LAPTOP', 'DESKTOP', 'MONITOR', 'PHONE', 'FURNITURE', 'VEHICLE', 'OTHER'
    serial_number VARCHAR(100),
    brand VARCHAR(100),
    model VARCHAR(100),
    purchase_date DATE,
    purchase_cost_bdt NUMERIC(12, 2),
    warranty_expiry_date DATE,
    condition VARCHAR(30) NOT NULL DEFAULT 'EXCELLENT', -- 'NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'DAMAGED'
    assigned_to_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ,
    branch_id UUID REFERENCES organization_branches(id),
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'ASSIGNED', 'IN_MAINTENANCE', 'RETIRED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_org_asset_tag UNIQUE (organization_id, asset_tag)
);

CREATE INDEX IF NOT EXISTS idx_assets_org ON assets(organization_id);
CREATE INDEX IF NOT EXISTS idx_assets_emp ON assets(assigned_to_employee_id);

-- 4. DOCUMENT MANAGEMENT
CREATE TABLE IF NOT EXISTS employee_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'APPOINTMENT_LETTER', 'CONTRACT', 'NID', 'PASSPORT', 'CERTIFICATE', 'POLICY', 'HANDBOOK'
    title VARCHAR(200) NOT NULL,
    file_path TEXT NOT NULL, -- Supabase Storage bucket path
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    expiry_date DATE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_org ON employee_documents(organization_id);
CREATE INDEX IF NOT EXISTS idx_documents_emp ON employee_documents(employee_id);


-- ==============================================================================
-- FILE: 20261112000008_communication_and_notifications.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 08: COMMUNICATION & NOTIFICATIONS
-- ==============================================================================

-- 1. ANNOUNCEMENTS
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    title_bn VARCHAR(200),
    content TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL', -- 'NORMAL', 'IMPORTANT', 'CRITICAL'
    target_type VARCHAR(30) NOT NULL DEFAULT 'ALL',  -- 'ALL', 'DEPARTMENT', 'BRANCH', 'ROLE'
    target_ids UUID[] DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    published_by UUID NOT NULL REFERENCES profiles(id),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_org ON announcements(organization_id);

-- 2. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    recipient_user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    title_bn VARCHAR(150),
    body TEXT NOT NULL,
    category VARCHAR(40) NOT NULL, -- 'ATTENDANCE', 'LEAVE', 'PAYROLL', 'TASK', 'ANNOUNCEMENT', 'SECURITY', 'SYSTEM'
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    action_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_org ON notifications(organization_id);

-- 3. CHAT CHANNELS & MESSAGES (INTERNAL WORKPLACE CHAT)
CREATE TABLE IF NOT EXISTS chat_channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'GROUP', -- 'DIRECT', 'GROUP', 'DEPARTMENT', 'PROJECT'
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_channel_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_channel_user UNIQUE (channel_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID NOT NULL REFERENCES chat_channels(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel_id, created_at);

-- 4. HR HELPDESK & SUPPORT TICKETS
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    ticket_number VARCHAR(30) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'HR', 'PAYROLL', 'IT_SUPPORT', 'FACILITY', 'GENERAL'
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'
    assigned_to UUID REFERENCES employees(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticket_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    message TEXT NOT NULL,
    attachment_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_org ON support_tickets(organization_id);
CREATE INDEX IF NOT EXISTS idx_tickets_emp ON support_tickets(employee_id);


-- ==============================================================================
-- FILE: 20261112000009_remote_configuration_and_devices.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 09: REMOTE CONFIGURATION & DEVICE CONTROLS
-- ==============================================================================

-- 1. FEATURE DEFINITIONS
CREATE TABLE IF NOT EXISTS feature_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(60) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- 'ATTENDANCE', 'PAYROLL', 'LEAVE', 'COMMUNICATION', 'GENERAL'
    default_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. GLOBAL & TENANT FEATURE FLAGS
CREATE TABLE IF NOT EXISTS feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key VARCHAR(60) NOT NULL REFERENCES feature_definitions(key) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = Global Platform Default
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    rollout_percentage INT NOT NULL DEFAULT 100, -- 0 to 100
    target_roles VARCHAR(40)[] DEFAULT '{}',
    min_app_version VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_feature_org UNIQUE (feature_key, organization_id)
);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(feature_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_org ON feature_flags(organization_id);

-- 3. REMOTE CONFIGURATION VERSIONS (IMMUTABLE PUBLISHED SNAPSHOTS)
CREATE TABLE IF NOT EXISTS remote_config_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = Global
    version_number INT NOT NULL,
    config_payload JSONB NOT NULL,
    published_by UUID NOT NULL REFERENCES profiles(id),
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    change_summary TEXT,
    CONSTRAINT uq_org_config_version UNIQUE (organization_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_remote_config_ver ON remote_config_versions(organization_id, version_number DESC);

-- 4. CURRENT ACTIVE REMOTE CONFIG
CREATE TABLE IF NOT EXISTS remote_config_active (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID UNIQUE REFERENCES organizations(id) ON DELETE CASCADE, -- NULL organization_id is represented via dedicated table or entry
    active_version_id UUID NOT NULL REFERENCES remote_config_versions(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. APP RELEASES & MAINTENANCE CONTROLS
CREATE TABLE IF NOT EXISTS app_releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(20) NOT NULL, -- 'ANDROID', 'IOS', 'WEB'
    latest_version VARCHAR(20) NOT NULL, -- e.g. '2.0.0'
    minimum_supported_version VARCHAR(20) NOT NULL, -- e.g. '1.9.0'
    force_update BOOLEAN NOT NULL DEFAULT FALSE,
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    maintenance_message TEXT DEFAULT 'WorkForce 360 is currently undergoing scheduled maintenance. Please check back shortly.',
    download_url TEXT,
    release_notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_release_platform UNIQUE (platform)
);

-- 6. REMOTE DEVICE COMMANDS & ACTIONS
CREATE TABLE IF NOT EXISTS remote_device_commands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID NOT NULL REFERENCES registered_devices(id) ON DELETE CASCADE,
    command_type VARCHAR(40) NOT NULL, -- 'LOCK_APP', 'WIPE_SESSION', 'FORCE_SYNC', 'DISPLAY_BANNER'
    payload JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'DELIVERED', 'ACKNOWLEDGED', 'FAILED'
    issued_by UUID NOT NULL REFERENCES profiles(id),
    delivered_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commands_device ON remote_device_commands(device_id, status);


-- ==============================================================================
-- FILE: 20261112000010_approval_workflows_and_audit.sql
-- ==============================================================================
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


-- ==============================================================================
-- FILE: 20261112000011_row_level_security_policies.sql
-- ==============================================================================
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


-- ==============================================================================
-- FILE: 20261112000012_database_functions_and_triggers.sql
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - MIGRATION 12: DATABASE FUNCTIONS, TRIGGERS & BUSINESS LOGIC
-- ==============================================================================

-- 1. HAVERSINE DISTANCE FORMULA (GEOFENCING VALIDATION)
CREATE OR REPLACE FUNCTION calculate_distance_meters(
    lat1 NUMERIC, lon1 NUMERIC,
    lat2 NUMERIC, lon2 NUMERIC
)
RETURNS NUMERIC
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
    r NUMERIC := 6371000; -- Earth radius in meters
    dlat NUMERIC;
    dlon NUMERIC;
    a NUMERIC;
    c NUMERIC;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat / 2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)^2;
    c := 2 * atan2(sqrt(a), sqrt(1 - a));
    RETURN r * c;
END;
$$;

-- 2. SECURE ATTENDANCE CHECK-IN / CHECK-OUT PROCEDURE
CREATE OR REPLACE FUNCTION record_attendance_punch(
    p_organization_id UUID,
    p_employee_id UUID,
    p_event_type VARCHAR, -- 'CHECK_IN' or 'CHECK_OUT'
    p_method VARCHAR,
    p_latitude NUMERIC,
    p_longitude NUMERIC,
    p_accuracy NUMERIC,
    p_device_id VARCHAR,
    p_idempotency_key UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_today DATE := CURRENT_DATE;
    v_now TIMESTAMPTZ := NOW();
    v_branch_lat NUMERIC;
    v_branch_lon NUMERIC;
    v_branch_radius INT;
    v_distance NUMERIC;
    v_is_within_geofence BOOLEAN := TRUE;
    v_shift_id UUID;
    v_shift_start TIME;
    v_grace_minutes INT;
    v_late_minutes INT := 0;
    v_status VARCHAR := 'PRESENT';
    v_existing_record attendance_records%ROWTYPE;
BEGIN
    -- 1. Check duplicate punch by idempotency key
    IF EXISTS (SELECT 1 FROM attendance_events WHERE idempotency_key = p_idempotency_key) THEN
        RETURN jsonb_build_object('success', false, 'error', 'DUPLICATE_IDEMPOTENCY_KEY');
    END IF;

    -- 2. Fetch employee branch geofence
    SELECT b.latitude, b.longitude, b.radius_meters, e.shift_id
    INTO v_branch_lat, v_branch_lon, v_branch_radius, v_shift_id
    FROM employees e
    JOIN organization_branches b ON b.id = e.branch_id
    WHERE e.id = p_employee_id AND e.organization_id = p_organization_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'EMPLOYEE_OR_BRANCH_NOT_FOUND');
    END IF;

    -- 3. Validate geofence distance if GPS coordinates provided
    IF p_latitude IS NOT NULL AND p_longitude IS NOT NULL AND v_branch_lat IS NOT NULL THEN
        v_distance := calculate_distance_meters(p_latitude, p_longitude, v_branch_lat, v_branch_lon);
        IF v_distance > v_branch_radius THEN
            v_is_within_geofence := FALSE;
        END IF;
    END IF;

    -- 4. Record raw audit event
    INSERT INTO attendance_events (
        organization_id, employee_id, event_type, event_timestamp,
        verification_method, latitude, longitude, accuracy_meters,
        is_within_geofence, device_id, idempotency_key, notes
    ) VALUES (
        p_organization_id, p_employee_id, p_event_type, v_now,
        p_method, p_latitude, p_longitude, p_accuracy,
        v_is_within_geofence, p_device_id, p_idempotency_key, p_notes
    );

    -- 5. Process Daily Summary Record
    SELECT * INTO v_existing_record
    FROM attendance_records
    WHERE employee_id = p_employee_id AND date = v_today;

    IF p_event_type = 'CHECK_IN' THEN
        -- Check late status against assigned shift
        SELECT start_time, grace_period_minutes
        INTO v_shift_start, v_grace_minutes
        FROM shifts WHERE id = v_shift_id;

        IF FOUND AND v_shift_start IS NOT NULL THEN
            IF (v_now::time > (v_shift_start + (v_grace_minutes || ' minutes')::interval)) THEN
                v_late_minutes := EXTRACT(EPOCH FROM (v_now::time - v_shift_start)) / 60;
                v_status := 'LATE';
            END IF;
        END IF;

        IF v_existing_record.id IS NULL THEN
            INSERT INTO attendance_records (
                organization_id, employee_id, date, shift_id,
                check_in_time, status, late_minutes, check_in_method,
                check_in_latitude, check_in_longitude, is_within_geofence
            ) VALUES (
                p_organization_id, p_employee_id, v_today, v_shift_id,
                v_now, v_status, v_late_minutes, p_method,
                p_latitude, p_longitude, v_is_within_geofence
            );
        END IF;
    ELSIF p_event_type = 'CHECK_OUT' THEN
        IF v_existing_record.id IS NOT NULL THEN
            UPDATE attendance_records
            SET check_out_time = v_now,
                check_out_method = p_method,
                working_minutes = GREATEST(0, EXTRACT(EPOCH FROM (v_now - check_in_time)) / 60),
                updated_at = NOW()
            WHERE id = v_existing_record.id;
        ELSE
            -- Checkout without prior check-in
            INSERT INTO attendance_records (
                organization_id, employee_id, date, shift_id,
                check_out_time, status, check_out_method, is_within_geofence
            ) VALUES (
                p_organization_id, p_employee_id, v_today, v_shift_id,
                v_now, 'PRESENT', p_method, v_is_within_geofence
            );
        END IF;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'event_type', p_event_type,
        'timestamp', v_now,
        'is_within_geofence', v_is_within_geofence
    );
END;
$$;

-- 3. ATOMIC LEAVE APPROVAL & BALANCE DEDUCTION
CREATE OR REPLACE FUNCTION approve_leave_request(
    p_leave_request_id UUID,
    p_approver_employee_id UUID,
    p_approver_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_request leave_requests%ROWTYPE;
    v_balance leave_balances%ROWTYPE;
    v_fiscal_year INT;
BEGIN
    SELECT * INTO v_request FROM leave_requests WHERE id = p_leave_request_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'REQUEST_NOT_FOUND');
    END IF;

    IF v_request.status = 'APPROVED' THEN
        RETURN jsonb_build_object('success', false, 'error', 'ALREADY_APPROVED');
    END IF;

    v_fiscal_year := EXTRACT(YEAR FROM v_request.start_date);

    -- Lock and verify leave balance
    SELECT * INTO v_balance
    FROM leave_balances
    WHERE employee_id = v_request.employee_id 
      AND leave_type_id = v_request.leave_type_id
      AND fiscal_year = v_fiscal_year
    FOR UPDATE;

    IF v_balance.remaining_days < v_request.total_days THEN
        RETURN jsonb_build_object('success', false, 'error', 'INSUFFICIENT_LEAVE_BALANCE');
    END IF;

    -- Update balance
    UPDATE leave_balances
    SET used_days = used_days + v_request.total_days,
        pending_days = GREATEST(0, pending_days - v_request.total_days),
        updated_at = NOW()
    WHERE id = v_balance.id;

    -- Record ledger transaction
    INSERT INTO leave_transactions (
        organization_id, employee_id, leave_type_id, leave_request_id,
        transaction_type, days, balance_after, created_by
    ) VALUES (
        v_request.organization_id, v_request.employee_id, v_request.leave_type_id,
        v_request.id, 'LEAVE_DEDUCTION', v_request.total_days,
        (v_balance.remaining_days - v_request.total_days), p_approver_user_id
    );

    -- Mark request approved
    UPDATE leave_requests
    SET status = 'APPROVED',
        approved_by = p_approver_employee_id,
        approved_at = NOW(),
        updated_at = NOW()
    WHERE id = p_leave_request_id;

    RETURN jsonb_build_object('success', true, 'status', 'APPROVED');
END;
$$;

-- 4. PAYROLL LOCKING & FINALIZATION PROCEDURE
CREATE OR REPLACE FUNCTION lock_payroll_run(
    p_payroll_run_id UUID,
    p_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_run payroll_runs%ROWTYPE;
BEGIN
    SELECT * INTO v_run FROM payroll_runs WHERE id = p_payroll_run_id FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'RUN_NOT_FOUND');
    END IF;

    IF v_run.status = 'LOCKED' OR v_run.locked_at IS NOT NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'PAYROLL_ALREADY_LOCKED');
    END IF;

    -- Lock the payroll run
    UPDATE payroll_runs
    SET status = 'LOCKED',
        locked_at = NOW(),
        finalized_by = p_user_id,
        finalized_at = NOW(),
        updated_at = NOW()
    WHERE id = p_payroll_run_id;

    -- Also lock the parent period
    UPDATE payroll_periods
    SET is_locked = TRUE
    WHERE id = v_run.period_id;

    -- Record audit log
    INSERT INTO audit_logs (
        organization_id, actor_user_id, action, resource_type, resource_id, after_snapshot
    ) VALUES (
        v_run.organization_id, p_user_id, 'PAYROLL_FINALIZED_AND_LOCKED',
        'payroll_runs', p_payroll_run_id::text,
        row_to_json(v_run)::jsonb
    );

    RETURN jsonb_build_object('success', true, 'status', 'LOCKED');
END;
$$;


-- ==============================================================================
-- INITIAL DEMO & SEED DATA
-- ==============================================================================
-- ==============================================================================
-- WORKFORCE 360 - SEED DATA: MULTI-TENANT ENTERPRISE FIXTURES (BANGLADESH)
-- ==============================================================================

-- 1. SUBSCRIPTION PLANS
INSERT INTO subscription_plans (id, name, code, monthly_price_bdt, annual_price_bdt, max_employees, max_branches, max_storage_gb, custom_branding, advanced_reports, audit_logs, api_access, support_tier)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Free Tier', 'FREE', 0, 0, 10, 1, 2, FALSE, FALSE, FALSE, FALSE, 'STANDARD'),
('a0000000-0000-0000-0000-000000000002', 'Starter Plan', 'STARTER', 4999, 49990, 50, 2, 10, FALSE, TRUE, FALSE, FALSE, 'STANDARD'),
('a0000000-0000-0000-0000-000000000003', 'Professional Plan', 'PROFESSIONAL', 14999, 149990, 200, 5, 50, TRUE, TRUE, TRUE, FALSE, 'PRIORITY'),
('a0000000-0000-0000-0000-000000000004', 'Business Plan', 'BUSINESS', 29999, 299990, 500, 10, 100, TRUE, TRUE, TRUE, TRUE, 'PRIORITY'),
('a0000000-0000-0000-0000-000000000005', 'Enterprise Plan', 'ENTERPRISE', 69999, 699990, 5000, 50, 500, TRUE, TRUE, TRUE, TRUE, 'DEDICATED')
ON CONFLICT (code) DO NOTHING;

-- 2. ORGANIZATIONS
INSERT INTO organizations (id, name, name_bn, slug, code, status, subscription_plan_id, currency, currency_symbol, timezone, address, phone, email, website)
VALUES
('b0000000-0000-0000-0000-000000000001', 'Innovate BD Ltd', 'à¦‡à¦¨à§‹à¦­à§‡à¦Ÿ à¦¬à¦¿à¦¡à¦¿ à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡', 'innovate-bd', 'IBD', 'ACTIVE', 'a0000000-0000-0000-0000-000000000005', 'BDT', '৳', 'Asia/Dhaka', 'Road 11, Block D, Banani, Dhaka-1213', '+8801711000001', 'info@innovatebd.com', 'https://innovatebd.com'),
('b0000000-0000-0000-0000-000000000002', 'TechCorp Ltd', 'à¦Ÿà§‡à¦•à¦•à¦°à§à¦ª à¦²à¦¿à¦®à¦¿à¦Ÿà§‡à¦¡', 'techcorp', 'TCL', 'ACTIVE', 'a0000000-0000-0000-0000-000000000004', 'BDT', '৳', 'Asia/Dhaka', 'Gulshan Avenue, Dhaka-1212', '+8801711000002', 'contact@techcorp.com', 'https://techcorp.com'),
('b0000000-0000-0000-0000-000000000003', 'Global Solutions', 'à¦—à§à¦²à§‹à¦¬à¦¾à¦² à¦¸à¦²à¦¿à¦‰à¦¶à¦¨à¦¸', 'globalsol', 'GSL', 'ACTIVE', 'a0000000-0000-0000-0000-000000000003', 'BDT', '৳', 'Asia/Dhaka', 'Agrabad C/A, Chittagong', '+8801711000003', 'support@globalsol.com', 'https://globalsol.com')
ON CONFLICT (slug) DO NOTHING;

-- 3. PROFILES
INSERT INTO profiles (id, email, full_name, full_name_bn, phone, is_platform_admin, preferred_language, preferred_theme)
VALUES
('c0000000-0000-0000-0000-000000000001', 'superadmin@workforce360.com', 'Md. Rahim Ahmed', 'à¦®à§‹. à¦°à¦¹à¦¿à¦® à¦†à¦¹à¦®à§‡à¦¦', '+8801700000001', TRUE, 'bn', 'light'),
('c0000000-0000-0000-0000-000000000002', 'admin@innovatebd.com', 'Tanvir Hasan', 'à¦¤à¦¾à¦¨à¦­à§€à¦° à¦¹à¦¾à¦¸à¦¾à¦¨', '+8801700000002', FALSE, 'bn', 'light'),
('c0000000-0000-0000-0000-000000000003', 'ahmed@workforce360.com', 'Ahmed Rahman', 'à¦†à¦¹à¦®à§‡à¦¦ à¦°à¦¹à¦®à¦¾à¦¨', '+8801712345678', FALSE, 'en', 'light'),
('c0000000-0000-0000-0000-000000000004', 'sarah@innovatebd.com', 'Sarah Khan', 'à¦¸à¦¾à¦°à¦¾à¦¹ à¦–à¦¾à¦¨', '+8801700000004', FALSE, 'en', 'light'),
('c0000000-0000-0000-0000-000000000005', 'rafiq@innovatebd.com', 'Rafiq Ahmed', 'à¦°à¦«à¦¿à¦• à¦†à¦¹à¦®à§‡à¦¦', '+8801700000005', FALSE, 'bn', 'light')
ON CONFLICT (email) DO NOTHING;

-- 4. PLATFORM ADMIN RECORD
INSERT INTO platform_admins (user_id, role)
VALUES ('c0000000-0000-0000-0000-000000000001', 'SUPER_ADMIN')
ON CONFLICT (user_id) DO NOTHING;

-- 5. BRANCHES (GEOFENCES)
INSERT INTO organization_branches (id, organization_id, name, name_bn, code, is_headquarters, address, city, latitude, longitude, radius_meters, contact_phone)
VALUES
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Head Office, Banani', 'à¦¹à§‡à¦¡ à¦…à¦«à¦¿à¦¸, à¦¬à¦¨à¦¾à¦¨à§€', 'HQ-BAN', TRUE, 'Road 11, Banani, Dhaka', 'Dhaka', 23.7937, 90.4048, 200, '+8801711000001'),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Dhanmondi Branch', 'à¦§à¦¾à¦¨à¦®à¦¨à§à¦¡à¦¿ à¦¶à¦¾à¦–à¦¾', 'BR-DHN', FALSE, 'Dhanmondi 27, Dhaka', 'Dhaka', 23.7461, 90.3742, 150, '+8801711000002')
ON CONFLICT DO NOTHING;

-- 6. DEPARTMENTS (5 TEAMS)
INSERT INTO departments (id, organization_id, branch_id, name, name_bn, code, budget_bdt)
VALUES
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Engineering & Technology', 'ইঞ্জিনিয়ারিং ও প্রযুক্তি', 'ENG', 2500000),
('e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Human Resources & Talent Operations', 'হিউম্যান রিসোর্সেস', 'HR', 800000),
('e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Sales, Marketing & Growth', 'মার্কেটিং ও সেলস', 'MKT', 1200000),
('e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Product, UI/UX & Design', 'প্রোডাক্ট ও ডিজাইন', 'DES', 1500000),
('e0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Finance, Payroll & Accounts', 'ফাইন্যান্স ও পেরোল', 'FIN', 1800000)
ON CONFLICT (id) DO NOTHING;

-- 7. DESIGNATIONS
INSERT INTO designations (id, organization_id, department_id, title, title_bn, level, min_salary_bdt, max_salary_bdt)
VALUES
('f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Software Engineer', 'à¦¸à¦«à¦Ÿà¦“à¦¯à¦¼à§à¦¯à¦¾à¦° à¦‡à¦žà§à¦œà¦¿à¦¨à¦¿à¦¯à¦¼à¦¾à¦°', 2, 45000, 95000),
('f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'HR Executive', 'à¦à¦‡à¦šà¦†à¦° à¦à¦•à§à¦¸à¦¿à¦•à¦¿à¦‰à¦Ÿà¦¿à¦­', 2, 35000, 65000),
('f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Engineering Team Lead', 'à¦‡à¦žà§à¦œà¦¿à¦¨à¦¿à¦¯à¦¼à¦¾à¦°à¦¿à¦‚ à¦Ÿà¦¿à¦® à¦²à¦¿à¦¡', 4, 90000, 160000)
ON CONFLICT DO NOTHING;

-- 8. SHIFTS
INSERT INTO shifts (id, organization_id, name, name_bn, code, start_time, end_time, grace_period_minutes, weekly_off_days)
VALUES
('10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Standard Corporate Shift', 'à¦¸à§à¦Ÿà§à¦¯à¦¾à¦¨à§à¦¡à¦¾à¦°à§à¦¡ à¦•à¦°à§à¦ªà§‹à¦°à§‡à¦Ÿ à¦¶à¦¿à¦«à¦Ÿ', 'STD-9TO6', '09:00:00', '18:00:00', 15, '{5, 6}')
ON CONFLICT DO NOTHING;

-- 9. LEAVE TYPES
INSERT INTO leave_types (id, organization_id, name, name_bn, code, annual_allocation_days, carry_forward_max_days, is_paid)
VALUES
('20000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Annual Leave', 'à¦¬à¦¾à¦°à§à¦·à¦¿à¦• à¦›à§à¦Ÿà¦¿', 'ANNUAL', 18, 5, TRUE),
('20000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Sick Leave', 'à¦…à¦¸à§à¦¸à§à¦¥à¦¤à¦¾à¦œà¦¨à¦¿à¦¤ à¦›à§à¦Ÿà¦¿', 'SICK', 14, 0, TRUE),
('20000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Casual Leave', 'à¦¨à§ˆà¦®à¦¿à¦¤à§à¦¤à¦¿à¦• à¦›à§à¦Ÿà¦¿', 'CASUAL', 10, 0, TRUE),
('20000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Emergency Leave', 'à¦œà¦°à§à¦°à§€ à¦›à§à¦Ÿà¦¿', 'SPECIAL', 5, 0, TRUE)
ON CONFLICT DO NOTHING;

-- 10. EMPLOYEES
INSERT INTO employees (id, organization_id, user_id, employee_code, first_name, last_name, first_name_bn, last_name_bn, email, phone, gender, joining_date, employment_type, status, branch_id, department_id, designation_id, shift_id, basic_salary_bdt, gross_salary_bdt, bank_name, bank_account_number)
VALUES
('30000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'EMP-001', 'Tanvir', 'Hasan', 'à¦¤à¦¾à¦¨à¦­à§€à¦°', 'à¦¹à¦¾à¦¸à¦¾à¦¨', 'admin@innovatebd.com', '+8801700000002', 'MALE', '2023-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 75000, 150000, 'City Bank Ltd', '1102938475001'),
('30000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'EMP-002', 'Ahmed', 'Rahman', 'à¦†à¦¹à¦®à§‡à¦¦', 'à¦°à¦¹à¦®à¦¾à¦¨', 'ahmed@workforce360.com', '+8801712345678', 'MALE', '2023-06-15', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 37500, 75000, 'BRAC Bank Ltd', '2203948576002'),
('30000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'EMP-003', 'Sarah', 'Khan', 'à¦¸à¦¾à¦°à¦¾à¦¹', 'à¦–à¦¾à¦¨', 'sarah@innovatebd.com', '+8801700000004', 'FEMALE', '2023-08-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 30000, 60000, 'Eastern Bank Ltd', '3304958671003')
ON CONFLICT DO NOTHING;

-- 10.1 FULL 100 EMPLOYEES ACROSS 5 TEAMS
INSERT INTO employees (id, organization_id, employee_code, first_name, last_name, email, phone, gender, joining_date, employment_type, status, branch_id, department_id, designation_id, shift_id, blood_group, basic_salary_bdt, gross_salary_bdt, bank_name, bank_account_number)
VALUES
('30000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000001', 'WF-1001', 'Tanvir', 'Hasan', 'tanvir.hasan@workforce360.com', '+880 1710071324', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 35000, 52500, 'City Bank Ltd', '100000000000000010'),
('30000000-0000-0000-0000-000000000011', 'b0000000-0000-0000-0000-000000000001', 'WF-1002', 'Ahmed', 'Rahman', 'ahmed.rahman@workforce360.com', '+880 1710142648', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 35600, 53400, 'City Bank Ltd', '100000000000000011'),
('30000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000001', 'WF-1003', 'Sarah', 'Khan', 'sarah.khan@workforce360.com', '+880 1710213972', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 36200, 54300, 'City Bank Ltd', '100000000000000012'),
('30000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000001', 'WF-1004', 'Mike', 'Johnson', 'mike.johnson@workforce360.com', '+880 1710285296', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 36800, 55200, 'City Bank Ltd', '100000000000000013'),
('30000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000001', 'WF-1005', 'Ayesha', 'Rahman', 'ayesha.rahman@workforce360.com', '+880 1710356620', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 37400, 56100, 'City Bank Ltd', '100000000000000014'),
('30000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000001', 'WF-1006', 'Fahim', 'Montasir', 'fahim.montasir@workforce360.com', '+880 1710427944', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 38000, 57000, 'City Bank Ltd', '100000000000000015'),
('30000000-0000-0000-0000-000000000016', 'b0000000-0000-0000-0000-000000000001', 'WF-1007', 'Nusrat', 'Jahan', 'nusrat.jahan@workforce360.com', '+880 1710499268', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 38600, 57900, 'City Bank Ltd', '100000000000000016'),
('30000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000001', 'WF-1008', 'Shakib', 'Al Hasan', 'shakib.al.hasan@workforce360.com', '+880 1710570592', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 39200, 58800, 'City Bank Ltd', '100000000000000017'),
('30000000-0000-0000-0000-000000000018', 'b0000000-0000-0000-0000-000000000001', 'WF-1009', 'Tahmid', 'Chowdhury', 'tahmid.chowdhury@workforce360.com', '+880 1710641916', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 39800, 59700, 'City Bank Ltd', '100000000000000018'),
('30000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000001', 'WF-1010', 'Farhana', 'Yeasmin', 'farhana.yeasmin@workforce360.com', '+880 1710713240', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 40400, 60600, 'City Bank Ltd', '100000000000000019'),
('30000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000001', 'WF-1011', 'Arifur', 'Rahman', 'arifur.rahman@workforce360.com', '+880 1710784564', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 41000, 61500, 'City Bank Ltd', '100000000000000020'),
('30000000-0000-0000-0000-000000000021', 'b0000000-0000-0000-0000-000000000001', 'WF-1012', 'Mehedi', 'Hasan', 'mehedi.hasan@workforce360.com', '+880 1710855888', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 41600, 62400, 'City Bank Ltd', '100000000000000021'),
('30000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000001', 'WF-1013', 'Sadia', 'Afrin', 'sadia.afrin@workforce360.com', '+880 1710927212', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 42200, 63300, 'City Bank Ltd', '100000000000000022'),
('30000000-0000-0000-0000-000000000023', 'b0000000-0000-0000-0000-000000000001', 'WF-1014', 'Rashedul', 'Islam', 'rashedul.islam@workforce360.com', '+880 1710998536', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 42800, 64200, 'City Bank Ltd', '100000000000000023'),
('30000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000001', 'WF-1015', 'Nabila', 'Sultana', 'nabila.sultana@workforce360.com', '+880 1711069860', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 43400, 65100, 'City Bank Ltd', '100000000000000024'),
('30000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000001', 'WF-1016', 'Zubair', 'Ahmed', 'zubair.ahmed@workforce360.com', '+880 1711141184', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 44000, 66000, 'City Bank Ltd', '100000000000000025'),
('30000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000001', 'WF-1017', 'Tasnim', 'Hossain', 'tasnim.hossain@workforce360.com', '+880 1711212508', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 44600, 66900, 'City Bank Ltd', '100000000000000026'),
('30000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000001', 'WF-1018', 'Imtiaz', 'Mahmud', 'imtiaz.mahmud@workforce360.com', '+880 1711283832', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 45200, 67800, 'City Bank Ltd', '100000000000000027'),
('30000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000001', 'WF-1019', 'Afsana', 'Mimi', 'afsana.mimi@workforce360.com', '+880 1711355156', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 45800, 68700, 'City Bank Ltd', '100000000000000028'),
('30000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000001', 'WF-1020', 'Mahfuzur', 'Rahman', 'mahfuzur.rahman@workforce360.com', '+880 1711426480', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 46400, 69600, 'City Bank Ltd', '100000000000000029'),
('30000000-0000-0000-0000-000000000030', 'b0000000-0000-0000-0000-000000000001', 'WF-1021', 'Joynal', 'Abedin', 'joynal.abedin@workforce360.com', '+880 1711497804', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 47000, 70500, 'City Bank Ltd', '100000000000000030'),
('30000000-0000-0000-0000-000000000031', 'b0000000-0000-0000-0000-000000000001', 'WF-1022', 'Rumana', 'Akter', 'rumana.akter@workforce360.com', '+880 1711569128', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 47600, 71400, 'City Bank Ltd', '100000000000000031'),
('30000000-0000-0000-0000-000000000032', 'b0000000-0000-0000-0000-000000000001', 'WF-1023', 'Tanmoy', 'Das', 'tanmoy.das@workforce360.com', '+880 1711640452', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 48200, 72300, 'City Bank Ltd', '100000000000000032'),
('30000000-0000-0000-0000-000000000033', 'b0000000-0000-0000-0000-000000000001', 'WF-1024', 'Shuvo', 'Karmakar', 'shuvo.karmakar@workforce360.com', '+880 1711711776', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 48800, 73200, 'City Bank Ltd', '100000000000000033'),
('30000000-0000-0000-0000-000000000034', 'b0000000-0000-0000-0000-000000000001', 'WF-1025', 'Rifat', 'Bin Alam', 'rifat.bin.alam@workforce360.com', '+880 1711783100', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 49400, 74100, 'City Bank Ltd', '100000000000000034'),
('30000000-0000-0000-0000-000000000035', 'b0000000-0000-0000-0000-000000000001', 'WF-1026', 'Sadia', 'Islam', 'sadia.islam@workforce360.com', '+880 1711854424', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 50000, 75000, 'City Bank Ltd', '100000000000000035'),
('30000000-0000-0000-0000-000000000036', 'b0000000-0000-0000-0000-000000000001', 'WF-1027', 'Rayhan', 'Kabir', 'rayhan.kabir@workforce360.com', '+880 1711925748', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 50600, 75900, 'City Bank Ltd', '100000000000000036'),
('30000000-0000-0000-0000-000000000037', 'b0000000-0000-0000-0000-000000000001', 'WF-1028', 'Tasnia', 'Firoz', 'tasnia.firoz@workforce360.com', '+880 1711997072', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 51200, 76800, 'City Bank Ltd', '100000000000000037'),
('30000000-0000-0000-0000-000000000038', 'b0000000-0000-0000-0000-000000000001', 'WF-1029', 'Anisur', 'Rahman', 'anisur.rahman@workforce360.com', '+880 1712068396', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 51800, 77700, 'City Bank Ltd', '100000000000000038'),
('30000000-0000-0000-0000-000000000039', 'b0000000-0000-0000-0000-000000000001', 'WF-1030', 'Fariha', 'Zaman', 'fariha.zaman@workforce360.com', '+880 1712139720', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 52400, 78600, 'City Bank Ltd', '100000000000000039'),
('30000000-0000-0000-0000-000000000040', 'b0000000-0000-0000-0000-000000000001', 'WF-1031', 'Sifat', 'Ullah', 'sifat.ullah@workforce360.com', '+880 1712211044', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 53000, 79500, 'City Bank Ltd', '100000000000000040'),
('30000000-0000-0000-0000-000000000041', 'b0000000-0000-0000-0000-000000000001', 'WF-1032', 'Sumaiya', 'Akhtar', 'sumaiya.akhtar@workforce360.com', '+880 1712282368', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 53600, 80400, 'City Bank Ltd', '100000000000000041'),
('30000000-0000-0000-0000-000000000042', 'b0000000-0000-0000-0000-000000000001', 'WF-1033', 'Nazmus', 'Sakib', 'nazmus.sakib@workforce360.com', '+880 1712353692', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 54200, 81300, 'City Bank Ltd', '100000000000000042'),
('30000000-0000-0000-0000-000000000043', 'b0000000-0000-0000-0000-000000000001', 'WF-1034', 'Munira', 'Khatun', 'munira.khatun@workforce360.com', '+880 1712425016', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 54800, 82200, 'City Bank Ltd', '100000000000000043'),
('30000000-0000-0000-0000-000000000044', 'b0000000-0000-0000-0000-000000000001', 'WF-1035', 'Ashraful', 'Haque', 'ashraful.haque@workforce360.com', '+880 1712496340', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 55400, 83100, 'City Bank Ltd', '100000000000000044'),
('30000000-0000-0000-0000-000000000045', 'b0000000-0000-0000-0000-000000000001', 'WF-1036', 'Dilruba', 'Shampa', 'dilruba.shampa@workforce360.com', '+880 1712567664', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 56000, 84000, 'City Bank Ltd', '100000000000000045'),
('30000000-0000-0000-0000-000000000046', 'b0000000-0000-0000-0000-000000000001', 'WF-1037', 'Rubel', 'Mia', 'rubel.mia@workforce360.com', '+880 1712638988', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 56600, 84900, 'City Bank Ltd', '100000000000000046'),
('30000000-0000-0000-0000-000000000047', 'b0000000-0000-0000-0000-000000000001', 'WF-1038', 'Samira', 'Tanjim', 'samira.tanjim@workforce360.com', '+880 1712710312', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 57200, 85800, 'City Bank Ltd', '100000000000000047'),
('30000000-0000-0000-0000-000000000048', 'b0000000-0000-0000-0000-000000000001', 'WF-1039', 'Kazi', 'Asif', 'kazi.asif@workforce360.com', '+880 1712781636', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 57800, 86700, 'City Bank Ltd', '100000000000000048'),
('30000000-0000-0000-0000-000000000049', 'b0000000-0000-0000-0000-000000000001', 'WF-1040', 'Farzana', 'Bobby', 'farzana.bobby@workforce360.com', '+880 1712852960', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 58400, 87600, 'City Bank Ltd', '100000000000000049'),
('30000000-0000-0000-0000-000000000050', 'b0000000-0000-0000-0000-000000000001', 'WF-1041', 'Shamsul', 'Arefin', 'shamsul.arefin@workforce360.com', '+880 1712924284', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 59000, 88500, 'City Bank Ltd', '100000000000000050'),
('30000000-0000-0000-0000-000000000051', 'b0000000-0000-0000-0000-000000000001', 'WF-1042', 'Nayla', 'Tarannum', 'nayla.tarannum@workforce360.com', '+880 1712995608', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 59600, 89400, 'City Bank Ltd', '100000000000000051'),
('30000000-0000-0000-0000-000000000052', 'b0000000-0000-0000-0000-000000000001', 'WF-1043', 'Jashim', 'Uddin', 'jashim.uddin@workforce360.com', '+880 1713066932', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 60200, 90300, 'City Bank Ltd', '100000000000000052'),
('30000000-0000-0000-0000-000000000053', 'b0000000-0000-0000-0000-000000000001', 'WF-1044', 'Shirin', 'Sharmin', 'shirin.sharmin@workforce360.com', '+880 1713138256', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 60800, 91200, 'City Bank Ltd', '100000000000000053'),
('30000000-0000-0000-0000-000000000054', 'b0000000-0000-0000-0000-000000000001', 'WF-1045', 'Touhidul', 'Islam', 'touhidul.islam@workforce360.com', '+880 1713209580', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 61400, 92100, 'City Bank Ltd', '100000000000000054'),
('30000000-0000-0000-0000-000000000055', 'b0000000-0000-0000-0000-000000000001', 'WF-1046', 'Nusrat', 'Jahan', 'nusrat.jahan@workforce360.com', '+880 1713280904', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 62000, 93000, 'City Bank Ltd', '100000000000000055'),
('30000000-0000-0000-0000-000000000056', 'b0000000-0000-0000-0000-000000000001', 'WF-1047', 'Kamrun', 'Nahar', 'kamrun.nahar@workforce360.com', '+880 1713352228', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 62600, 93900, 'City Bank Ltd', '100000000000000056'),
('30000000-0000-0000-0000-000000000057', 'b0000000-0000-0000-0000-000000000001', 'WF-1048', 'Saifuddin', 'Ahmed', 'saifuddin.ahmed@workforce360.com', '+880 1713423552', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 63200, 94800, 'City Bank Ltd', '100000000000000057'),
('30000000-0000-0000-0000-000000000058', 'b0000000-0000-0000-0000-000000000001', 'WF-1049', 'Tania', 'Parveen', 'tania.parveen@workforce360.com', '+880 1713494876', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 63800, 95700, 'City Bank Ltd', '100000000000000058'),
('30000000-0000-0000-0000-000000000059', 'b0000000-0000-0000-0000-000000000001', 'WF-1050', 'Mokhlesur', 'Rahman', 'mokhlesur.rahman@workforce360.com', '+880 1713566200', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 64400, 96600, 'City Bank Ltd', '100000000000000059'),
('30000000-0000-0000-0000-000000000060', 'b0000000-0000-0000-0000-000000000001', 'WF-1051', 'Nasrin', 'Akter', 'nasrin.akter@workforce360.com', '+880 1713637524', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 65000, 97500, 'City Bank Ltd', '100000000000000060'),
('30000000-0000-0000-0000-000000000061', 'b0000000-0000-0000-0000-000000000001', 'WF-1052', 'Belal', 'Hossain', 'belal.hossain@workforce360.com', '+880 1713708848', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 65600, 98400, 'City Bank Ltd', '100000000000000061'),
('30000000-0000-0000-0000-000000000062', 'b0000000-0000-0000-0000-000000000001', 'WF-1053', 'Sharmin', 'Sultana', 'sharmin.sultana@workforce360.com', '+880 1713780172', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 66200, 99300, 'City Bank Ltd', '100000000000000062'),
('30000000-0000-0000-0000-000000000063', 'b0000000-0000-0000-0000-000000000001', 'WF-1054', 'Atiqul', 'Islam', 'atiqul.islam@workforce360.com', '+880 1713851496', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 66800, 100200, 'City Bank Ltd', '100000000000000063'),
('30000000-0000-0000-0000-000000000064', 'b0000000-0000-0000-0000-000000000001', 'WF-1055', 'Farhana', 'Haque', 'farhana.haque@workforce360.com', '+880 1713922820', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 67400, 101100, 'City Bank Ltd', '100000000000000064'),
('30000000-0000-0000-0000-000000000065', 'b0000000-0000-0000-0000-000000000001', 'WF-1056', 'Ziaur', 'Rahman', 'ziaur.rahman@workforce360.com', '+880 1713994144', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 68000, 102000, 'City Bank Ltd', '100000000000000065'),
('30000000-0000-0000-0000-000000000066', 'b0000000-0000-0000-0000-000000000001', 'WF-1057', 'Pervin', 'Sultana', 'pervin.sultana@workforce360.com', '+880 1714065468', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 68600, 102900, 'City Bank Ltd', '100000000000000066'),
('30000000-0000-0000-0000-000000000067', 'b0000000-0000-0000-0000-000000000001', 'WF-1058', 'Monirul', 'Islam', 'monirul.islam@workforce360.com', '+880 1714136792', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 69200, 103800, 'City Bank Ltd', '100000000000000067'),
('30000000-0000-0000-0000-000000000068', 'b0000000-0000-0000-0000-000000000001', 'WF-1059', 'Sabina', 'Yasmin', 'sabina.yasmin@workforce360.com', '+880 1714208116', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 69800, 104700, 'City Bank Ltd', '100000000000000068'),
('30000000-0000-0000-0000-000000000069', 'b0000000-0000-0000-0000-000000000001', 'WF-1060', 'Muntasir', 'Billah', 'muntasir.billah@workforce360.com', '+880 1714279440', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 70400, 105600, 'City Bank Ltd', '100000000000000069'),
('30000000-0000-0000-0000-000000000070', 'b0000000-0000-0000-0000-000000000001', 'WF-1061', 'Jesmin', 'Ara', 'jesmin.ara@workforce360.com', '+880 1714350764', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 71000, 106500, 'City Bank Ltd', '100000000000000070'),
('30000000-0000-0000-0000-000000000071', 'b0000000-0000-0000-0000-000000000001', 'WF-1062', 'Anwar', 'Hossain', 'anwar.hossain@workforce360.com', '+880 1714422088', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 71600, 107400, 'City Bank Ltd', '100000000000000071'),
('30000000-0000-0000-0000-000000000072', 'b0000000-0000-0000-0000-000000000001', 'WF-1063', 'Nilufar', 'Yasmin', 'nilufar.yasmin@workforce360.com', '+880 1714493412', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 72200, 108300, 'City Bank Ltd', '100000000000000072'),
('30000000-0000-0000-0000-000000000073', 'b0000000-0000-0000-0000-000000000001', 'WF-1064', 'Kamrul', 'Ahsan', 'kamrul.ahsan@workforce360.com', '+880 1714564736', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 72800, 109200, 'City Bank Ltd', '100000000000000073'),
('30000000-0000-0000-0000-000000000074', 'b0000000-0000-0000-0000-000000000001', 'WF-1065', 'Md.', 'Zahidul Islam', 'md.zahidul.islam@workforce360.com', '+880 1714636060', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 73400, 110100, 'City Bank Ltd', '100000000000000074'),
('30000000-0000-0000-0000-000000000075', 'b0000000-0000-0000-0000-000000000001', 'WF-1066', 'Fatema', 'Begum', 'fatema.begum@workforce360.com', '+880 1714707384', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 74000, 111000, 'City Bank Ltd', '100000000000000075'),
('30000000-0000-0000-0000-000000000076', 'b0000000-0000-0000-0000-000000000001', 'WF-1067', 'Habibur', 'Rahman', 'habibur.rahman@workforce360.com', '+880 1714778708', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 74600, 111900, 'City Bank Ltd', '100000000000000076'),
('30000000-0000-0000-0000-000000000077', 'b0000000-0000-0000-0000-000000000001', 'WF-1068', 'Shahnaz', 'Parvin', 'shahnaz.parvin@workforce360.com', '+880 1714850032', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 75200, 112800, 'City Bank Ltd', '100000000000000077'),
('30000000-0000-0000-0000-000000000078', 'b0000000-0000-0000-0000-000000000001', 'WF-1069', 'Rezaul', 'Karim', 'rezaul.karim@workforce360.com', '+880 1714921356', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 75800, 113700, 'City Bank Ltd', '100000000000000078'),
('30000000-0000-0000-0000-000000000079', 'b0000000-0000-0000-0000-000000000001', 'WF-1070', 'Morshed', 'Alam', 'morshed.alam@workforce360.com', '+880 1714992680', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 76400, 114600, 'City Bank Ltd', '100000000000000079'),
('30000000-0000-0000-0000-000000000080', 'b0000000-0000-0000-0000-000000000001', 'WF-1071', 'Parveen', 'Akhtar', 'parveen.akhtar@workforce360.com', '+880 1715064004', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 77000, 115500, 'City Bank Ltd', '100000000000000080'),
('30000000-0000-0000-0000-000000000081', 'b0000000-0000-0000-0000-000000000001', 'WF-1072', 'Selim', 'Reza', 'selim.reza@workforce360.com', '+880 1715135328', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 77600, 116400, 'City Bank Ltd', '100000000000000081'),
('30000000-0000-0000-0000-000000000082', 'b0000000-0000-0000-0000-000000000001', 'WF-1073', 'Shahinur', 'Rahman', 'shahinur.rahman@workforce360.com', '+880 1715206652', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 78200, 117300, 'City Bank Ltd', '100000000000000082'),
('30000000-0000-0000-0000-000000000083', 'b0000000-0000-0000-0000-000000000001', 'WF-1074', 'Nazma', 'Begum', 'nazma.begum@workforce360.com', '+880 1715277976', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 78800, 118200, 'City Bank Ltd', '100000000000000083'),
('30000000-0000-0000-0000-000000000084', 'b0000000-0000-0000-0000-000000000001', 'WF-1075', 'Tariqul', 'Islam', 'tariqul.islam@workforce360.com', '+880 1715349300', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 79400, 119100, 'City Bank Ltd', '100000000000000084'),
('30000000-0000-0000-0000-000000000085', 'b0000000-0000-0000-0000-000000000001', 'WF-1076', 'Rina', 'Begum', 'rina.begum@workforce360.com', '+880 1715420624', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 80000, 120000, 'City Bank Ltd', '100000000000000085'),
('30000000-0000-0000-0000-000000000086', 'b0000000-0000-0000-0000-000000000001', 'WF-1077', 'Enamul', 'Haque', 'enamul.haque@workforce360.com', '+880 1715491948', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 80600, 120900, 'City Bank Ltd', '100000000000000086'),
('30000000-0000-0000-0000-000000000087', 'b0000000-0000-0000-0000-000000000001', 'WF-1078', 'Hasina', 'Akhter', 'hasina.akhter@workforce360.com', '+880 1715563272', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 81200, 121800, 'City Bank Ltd', '100000000000000087'),
('30000000-0000-0000-0000-000000000088', 'b0000000-0000-0000-0000-000000000001', 'WF-1079', 'Liton', 'Kumar', 'liton.kumar@workforce360.com', '+880 1715634596', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 81800, 122700, 'City Bank Ltd', '100000000000000088'),
('30000000-0000-0000-0000-000000000089', 'b0000000-0000-0000-0000-000000000001', 'WF-1080', 'Anwara', 'Khatun', 'anwara.khatun@workforce360.com', '+880 1715705920', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 82400, 123600, 'City Bank Ltd', '100000000000000089'),
('30000000-0000-0000-0000-000000000090', 'b0000000-0000-0000-0000-000000000001', 'WF-1081', 'Asif', 'Iqbal', 'asif.iqbal@workforce360.com', '+880 1715777244', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 83000, 124500, 'City Bank Ltd', '100000000000000090'),
('30000000-0000-0000-0000-000000000091', 'b0000000-0000-0000-0000-000000000001', 'WF-1082', 'Farhan', 'Kabir', 'farhan.kabir@workforce360.com', '+880 1715848568', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 83600, 125400, 'City Bank Ltd', '100000000000000091'),
('30000000-0000-0000-0000-000000000092', 'b0000000-0000-0000-0000-000000000001', 'WF-1083', 'Shamima', 'Nasrin', 'shamima.nasrin@workforce360.com', '+880 1715919892', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 84200, 126300, 'City Bank Ltd', '100000000000000092'),
('30000000-0000-0000-0000-000000000093', 'b0000000-0000-0000-0000-000000000001', 'WF-1084', 'Babul', 'Mia', 'babul.mia@workforce360.com', '+880 1715991216', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 84800, 127200, 'City Bank Ltd', '100000000000000093'),
('30000000-0000-0000-0000-000000000094', 'b0000000-0000-0000-0000-000000000001', 'WF-1085', 'Rokeya', 'Begum', 'rokeya.begum@workforce360.com', '+880 1716062540', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 85400, 128100, 'City Bank Ltd', '100000000000000094'),
('30000000-0000-0000-0000-000000000095', 'b0000000-0000-0000-0000-000000000001', 'WF-1086', 'Jahangir', 'Alam', 'jahangir.alam@workforce360.com', '+880 1716133864', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 86000, 129000, 'City Bank Ltd', '100000000000000095'),
('30000000-0000-0000-0000-000000000096', 'b0000000-0000-0000-0000-000000000001', 'WF-1087', 'Rehana', 'Akhter', 'rehana.akhter@workforce360.com', '+880 1716205188', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 86600, 129900, 'City Bank Ltd', '100000000000000096'),
('30000000-0000-0000-0000-000000000097', 'b0000000-0000-0000-0000-000000000001', 'WF-1088', 'Sirajul', 'Islam', 'sirajul.islam@workforce360.com', '+880 1716276512', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 87200, 130800, 'City Bank Ltd', '100000000000000097'),
('30000000-0000-0000-0000-000000000098', 'b0000000-0000-0000-0000-000000000001', 'WF-1089', 'Maya', 'Rani', 'maya.rani@workforce360.com', '+880 1716347836', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 87800, 131700, 'City Bank Ltd', '100000000000000098'),
('30000000-0000-0000-0000-000000000099', 'b0000000-0000-0000-0000-000000000001', 'WF-1090', 'Delwar', 'Hossain', 'delwar.hossain@workforce360.com', '+880 1716419160', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 88400, 132600, 'City Bank Ltd', '100000000000000099'),
('30000000-0000-0000-0000-000000000100', 'b0000000-0000-0000-0000-000000000001', 'WF-1091', 'Shima', 'Sultana', 'shima.sultana@workforce360.com', '+880 1716490484', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 89000, 133500, 'City Bank Ltd', '100000000000000100'),
('30000000-0000-0000-0000-000000000101', 'b0000000-0000-0000-0000-000000000001', 'WF-1092', 'Motaleb', 'Hossain', 'motaleb.hossain@workforce360.com', '+880 1716561808', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 89600, 134400, 'City Bank Ltd', '100000000000000101'),
('30000000-0000-0000-0000-000000000102', 'b0000000-0000-0000-0000-000000000001', 'WF-1093', 'Parul', 'Akter', 'parul.akter@workforce360.com', '+880 1716633132', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A-', 90200, 135300, 'City Bank Ltd', '100000000000000102'),
('30000000-0000-0000-0000-000000000103', 'b0000000-0000-0000-0000-000000000001', 'WF-1094', 'Golam', 'Mostafa', 'golam.mostafa@workforce360.com', '+880 1716704456', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B-', 90800, 136200, 'City Bank Ltd', '100000000000000103'),
('30000000-0000-0000-0000-000000000104', 'b0000000-0000-0000-0000-000000000001', 'WF-1095', 'Shafiul', 'Alam', 'shafiul.alam@workforce360.com', '+880 1716775780', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O-', 91400, 137100, 'City Bank Ltd', '100000000000000104'),
('30000000-0000-0000-0000-000000000105', 'b0000000-0000-0000-0000-000000000001', 'WF-1096', 'Shahadat', 'Hossain', 'shahadat.hossain@workforce360.com', '+880 1716847104', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 92000, 138000, 'City Bank Ltd', '100000000000000105'),
('30000000-0000-0000-0000-000000000106', 'b0000000-0000-0000-0000-000000000001', 'WF-1097', 'Salma', 'Begum', 'salma.begum@workforce360.com', '+880 1716918428', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'A+', 92600, 138900, 'City Bank Ltd', '100000000000000106'),
('30000000-0000-0000-0000-000000000107', 'b0000000-0000-0000-0000-000000000001', 'WF-1098', 'Azim', 'Uddin', 'azim.uddin@workforce360.com', '+880 1716989752', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'B+', 93200, 139800, 'City Bank Ltd', '100000000000000107'),
('30000000-0000-0000-0000-000000000108', 'b0000000-0000-0000-0000-000000000001', 'WF-1099', 'Morium', 'Begum', 'morium.begum@workforce360.com', '+880 1717061076', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'O+', 93800, 140700, 'City Bank Ltd', '100000000000000108'),
('30000000-0000-0000-0000-000000000109', 'b0000000-0000-0000-0000-000000000001', 'WF-1100', 'Zakir', 'Hossain', 'zakir.hossain@workforce360.com', '+880 1717132400', 'MALE', '2024-01-01', 'FULL_TIME', 'ACTIVE', 'd0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AB+', 94400, 141600, 'City Bank Ltd', '100000000000000109')
ON CONFLICT (organization_id, employee_code) DO NOTHING;

-- 11. ORGANIZATION MEMBERSHIPS
INSERT INTO organization_memberships (user_id, organization_id, role, is_active)
VALUES
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'COMPANY_ADMIN', TRUE),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'EMPLOYEE', TRUE),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'HR_ADMIN', TRUE)
ON CONFLICT DO NOTHING;

-- 12. LEAVE BALANCES FOR AHMED RAHMAN (Matches Screenshot: Annual 18, Sick 12, Casual 8, Emergency 5)
INSERT INTO leave_balances (organization_id, employee_id, leave_type_id, fiscal_year, allocated_days, used_days, pending_days, carried_over_days)
VALUES
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 2025, 18, 0, 0, 0),
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 2025, 14, 2, 0, 0),
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 2025, 10, 2, 0, 0),
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 2025, 5, 0, 0, 0)
ON CONFLICT DO NOTHING;

-- 13. TASKS (Matches Screenshot: Complete UI Design, Fix Login Bug, Prepare Report, Update Documentation)
INSERT INTO tasks (id, organization_id, title, description, assigned_to_employee_id, created_by_id, priority, status, deadline, progress_percentage)
VALUES
('40000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Complete UI Design', 'Redesign employee dashboard and leave request flows with modern components', '30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'HIGH', 'IN_PROGRESS', NOW() + INTERVAL '1 day', 75),
('40000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Fix Login Bug', 'Investigate offline authentication token caching issue on Android', '30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'HIGH', 'TODO', NOW() + INTERVAL '2 days', 20),
('40000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Prepare Report', 'Generate monthly department utilization and payroll summary for Q1', '30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'LOW', 'TODO', NOW() + INTERVAL '3 days', 0)
ON CONFLICT DO NOTHING;

-- 14. FEATURE FLAGS (REMOTE CONTROLS)
INSERT INTO feature_definitions (key, name, description, category, default_enabled)
VALUES
('attendance.gps_geofence', 'GPS Geofencing Attendance', 'Validates location coordinates within office perimeter', 'ATTENDANCE', TRUE),
('attendance.qr_code', 'QR Attendance', 'Allows dynamic QR code scanning at office kiosk', 'ATTENDANCE', TRUE),
('leave.management', 'Leave Engine', 'Leave application, approval and balance ledger', 'LEAVE', TRUE),
('payroll.engine', 'Payroll & BDT Payslips', 'Automated tax and salary calculations', 'PAYROLL', TRUE),
('tasks.projects', 'Task & Project Collaboration', 'Task boards, checklists and progress tracking', 'GENERAL', TRUE),
('mobile.remote_lock', 'Remote Device App Lock', 'Ability to remotely lock mobile app access', 'SECURITY', TRUE)
ON CONFLICT (key) DO NOTHING;

INSERT INTO feature_flags (feature_key, organization_id, is_enabled, rollout_percentage)
VALUES
('attendance.gps_geofence', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('attendance.qr_code', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('leave.management', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('payroll.engine', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('tasks.projects', 'b0000000-0000-0000-0000-000000000001', TRUE, 100),
('mobile.remote_lock', 'b0000000-0000-0000-0000-000000000001', TRUE, 100)
ON CONFLICT (feature_key, organization_id) DO NOTHING;


