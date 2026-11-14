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
