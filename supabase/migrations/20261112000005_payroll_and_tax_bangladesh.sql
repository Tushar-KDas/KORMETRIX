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
