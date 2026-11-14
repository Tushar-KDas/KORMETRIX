# WORKFORCE 360 — SUPABASE BACKEND SETUP GUIDE

## 1. Prerequisites
- A Supabase Project (cloud or self-hosted)
- Supabase CLI installed or Direct SQL access via Supabase Dashboard SQL Editor
- PostgreSQL 15+ with `pgcrypto` and `uuid-ossp` extensions enabled

---

## 2. Automated Migration Deployment
All migrations are ordered sequentially in `supabase/migrations/`:
```bash
# Applying migrations via Supabase CLI
supabase db push

# Or via psql connection string
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000001_core_organizations_and_identity.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000002_employees_and_departments.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000003_attendance_and_shifts.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000004_leave_and_ledger.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000005_payroll_and_tax_bangladesh.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000006_workforce_tasks_and_performance.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000007_finance_assets_and_documents.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000008_communication_and_notifications.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000009_remote_configuration_and_devices.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000010_approval_workflows_and_audit.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000011_row_level_security_policies.sql
psql "$SUPABASE_DB_URL" -f supabase/migrations/20261112000012_database_functions_and_triggers.sql
```

---

## 3. Seed Development & Demo Data
Load multi-tenant Bangladesh fixtures into your database:
```bash
psql "$SUPABASE_DB_URL" -f supabase/seed/seed.sql
```

This seeds:
- 5 Subscription tiers (`FREE`, `STARTER`, `PROFESSIONAL`, `BUSINESS`, `ENTERPRISE`)
- 3 Multi-tenant organizations (`Innovate BD Ltd`, `TechCorp Ltd`, `Global Solutions`)
- 2 Geofenced branches (Head Office Banani HQ with 200m radius; Dhanmondi Branch with 150m radius)
- Departments, Designations, Shift schedules, and Bangladesh public holidays
- Employees (`Tanvir Hasan`, `Ahmed Rahman`, `Sarah Khan`, `Rafiq Ahmed`)
- April 2025 finalized payroll snapshot (৳ 2,45,000 disbursement)
- Dynamic feature flags and remote configuration defaults

---

## 4. Private Storage Buckets Configuration
Create the following private storage buckets in the Supabase Dashboard:
1. `employee-documents` (Private - contracts, NID copies, appointment letters)
2. `payslip-pdfs` (Private - generated sealed payslip PDF documents)
3. `expense-receipts` (Private - submitted reimbursement vouchers)
4. `organization-assets` (Public - company logos and avatars)
