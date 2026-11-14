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
