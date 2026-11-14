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
