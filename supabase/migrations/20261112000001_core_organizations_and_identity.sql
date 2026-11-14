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
