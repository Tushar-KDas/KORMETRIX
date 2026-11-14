# WORKFORCE 360 — ENTERPRISE SECURITY & COMPLIANCE

## 1. Security Architecture Principles

WorkForce 360 adheres to zero-trust multi-tenant principles:
1. **Never Trust the Client:** Geofence validation, attendance timestamps, leave balance ledger deductions, and payroll calculation locks are executed and verified on the server.
2. **Tenant Boundary Isolation:** Tenant boundaries are strictly enforced via PostgreSQL Row Level Security (RLS) on all exposed tables.
3. **Least Privilege Scoping:**
   - Platform Super Admins have global SaaS governance but no automated access to private employee payslips without explicit audit-logged support approval.
   - Company Admins govern their specific company only.
   - Department Managers and Team Leads are scoped exclusively to their designated `departmentScope` or `branchScope`.
   - Employees are isolated to their own records.
4. **Confidential Payslip Protection:** Itemized payroll and payslip documents are sealed. Employees can only access their own payslip through row-level policies checking `employee_id = get_my_employee_id(organization_id)`.

---

## 2. Threat Vector Mitigations

| Threat | Risk Level | Mitigation Strategy |
|--------|------------|---------------------|
| **Cross-Tenant Data Leakage** | CRITICAL | RLS enabled on all tables; every query scoped via `auth.uid()` and verified `organization_memberships`. |
| **Insecure Direct Object Reference (IDOR)** | HIGH | Primary keys are non-sequential UUIDv4; database policies enforce caller ownership. |
| **Attendance GPS Spoofing** | HIGH | Client coordinates are validated against branch geofence using PostgreSQL Haversine distance formula; server generates immutable timestamp. |
| **Duplicate Attendance Punches** | MEDIUM | Idempotency keys required on every punch event; unique constraint prevents replay attacks. |
| **Payroll Tampering / Double Run** | HIGH | Payroll runs are wrapped in database transactions; finalizing sets `is_locked = TRUE` and locks parent period. Corrections require reversal adjustments. |
| **Credential & Secret Exposure** | CRITICAL | Supabase `service_role` secrets are kept exclusively in trusted server-side environments; never bundled into Flutter or web client assets. |
| **Compromised Mobile Device** | HIGH | Platform Super Admin can issue instant `LOCK_APP` or `WIPE_SESSION` command via Supabase Realtime broadcast to neutralize stolen devices. |
