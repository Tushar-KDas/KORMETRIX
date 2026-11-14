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
