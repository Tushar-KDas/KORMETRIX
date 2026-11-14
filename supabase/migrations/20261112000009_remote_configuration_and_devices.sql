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
