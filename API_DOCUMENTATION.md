# WORKFORCE 360 — API DOCUMENTATION & CONTRACTS

## 1. Overview
All client-to-backend communication uses standardized envelopes defined in `@workforce360/api-contracts`.

### Base Response Envelope
```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: ApiErrorCode;
    message: string;
    details?: any;
  };
  metadata?: {
    timestamp: string;
    correlationId?: string;
    pagination?: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}
```

---

## 2. Attendance Endpoints

### `POST /api/attendance/punch`
Records an employee check-in or check-out event. Validates coordinates against the assigned branch geofence using PostgreSQL Haversine distance calculations.

**Request Payload:**
```json
{
  "organizationId": "b0000000-0000-0000-0000-000000000001",
  "employeeId": "30000000-0000-0000-0000-000000000002",
  "shiftId": "10000000-0000-0000-0000-000000000001",
  "timestamp": "2025-04-28T09:15:00.000Z",
  "latitude": 23.7937,
  "longitude": 90.4048,
  "accuracyMeters": 15.2,
  "method": "GPS_GEOFENCE",
  "idempotencyKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "notes": "Office check-in at Banani HQ"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "status": "PRESENT",
    "isWithinGeofence": true,
    "checkInTime": "2025-04-28T09:15:00.000Z"
  }
}
```

---

## 3. Leave Management Endpoints

### `POST /api/leave/request`
Submits a leave application and creates pending ledger reservations.

**Request Payload:**
```json
{
  "organizationId": "b0000000-0000-0000-0000-000000000001",
  "employeeId": "30000000-0000-0000-0000-000000000002",
  "leaveTypeId": "20000000-0000-0000-0000-000000000001",
  "startDate": "2025-04-30",
  "endDate": "2025-05-02",
  "reason": "Family wedding event in Chittagong"
}
```

---

## 4. Payroll Endpoints

### `POST /api/payroll/finalize`
Atomic transaction to lock a monthly payroll run and generate sealed employee payslips.

**Request Payload:**
```json
{
  "payrollRunId": "50000000-0000-0000-0000-000000000001",
  "approvalNotes": "Approved by Finance Director for April 2025 disbursement"
}
```

---

## 5. Remote Configuration Endpoints

### `POST /api/remote-config/publish`
Publishes an immutable remote configuration snapshot and broadcasts an invalidation signal to connected clients via Supabase Realtime Broadcast.
