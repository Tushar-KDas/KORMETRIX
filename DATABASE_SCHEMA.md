# WORKFORCE 360 — DATABASE SCHEMA SPECIFICATION

## 1. Overview
The WorkForce 360 database runs on PostgreSQL 15 with UUID primary keys, foreign key constraints, timestamptz audit timestamps, and Row Level Security on all tenant-facing tables.

---

## 2. Core Tables Dictionary

### A. Organizations & Identity
- `subscription_plans`: Definition of SaaS plans (Free, Starter, Professional, Business, Enterprise) with monthly/annual BDT pricing and resource limits.
- `organizations`: Tenant records with name, slug, code, currency (BDT), timezone (`Asia/Dhaka`), and status (`ACTIVE`, `SUSPENDED`).
- `organization_settings`: Operational configurations (geofence enforcement, manual punch allowance, weekly weekend days).
- `profiles`: Identity profiles extending `auth.users` with language preference (`bn`/`en`), theme, and phone.
- `platform_admins`: Super admin access records.
- `organization_memberships`: User-to-tenant mapping with assigned role (`COMPANY_ADMIN`, `HR_ADMIN`, `MANAGER`, `EMPLOYEE`), branch scope, and department scope.
- `registered_devices`: Mobile hardware fingerprinting, FCM push tokens, and remote lock status.

### B. Workforce & Human Resources
- `organization_branches`: Office locations with latitude, longitude, and geofence radius in meters.
- `departments`: Functional business units with department head assignments and BDT budget allocations.
- `designations`: Job titles, hierarchical levels, and salary pay bands.
- `employees`: Core employee records with personal details, status, joining date, reporting manager, and basic/gross salary.
- `employee_emergency_contacts`: Emergency contacts and relationships.

### C. Attendance & Shifts
- `shifts`: Shift schedules with start/end time, grace period in minutes, and weekly off days (`{5, 6}` for Bangladesh).
- `attendance_events`: Immutable raw punch events with GPS coordinates, accuracy, geofence validation flag, and idempotency key.
- `attendance_records`: Derived daily summary with working minutes, overtime, late arrival minutes, and verification method.
- `attendance_adjustments`: Missing punch / time correction requests with approval status.

### D. Leave Management & Ledger
- `leave_types`: Leave policies (Annual 18, Sick 14, Casual 10, Emergency 5, Maternity 112).
- `leave_balances`: Annual employee balance ledger with allocated, used, pending, and remaining days.
- `leave_requests`: Employee leave applications with 2-stage approval status and attachments.
- `leave_transactions`: Immutable double-entry ledger for leave balance credits, accruals, and deductions.

### E. Payroll & Bangladesh Tax Engine
- `salary_components`: Earnings and deduction component rules (Basic 50%, House Rent 25%, Medical 15%, Conveyance 10%).
- `employee_salary_assignments`: Individual salary structure assignments and effective dates.
- `tax_rule_versions`: Versioned Bangladesh Finance Act income tax slabs and exemption limits.
- `payroll_periods`: Monthly pay cycle records (e.g., April 2025).
- `payroll_runs`: Batch payroll execution headers with status (`DRAFT`, `LOCKED`, `PAID`).
- `payslips`: Itemized employee payslip records with basic, allowances, tax deduction, and net payable BDT.

### F. Tasks, Projects & Performance
- `projects`: Project boards with milestones, status, and budget.
- `tasks`: Tasks with priority (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`), status, deadlines, and checklists.
- `employee_goals`: OKRs and KPIs with target values and progress weightage.
- `performance_reviews`: Appraisal cycles with self-assessment and manager ratings.

### G. Remote Control & Audit Logs
- `feature_flags`: Dynamic feature flags by organization and platform.
- `remote_config_versions`: Immutable published configuration snapshots.
- `app_releases`: Version gating, minimum supported versions, and maintenance mode.
- `audit_logs`: Forensic audit records with actor ID, action, resource, before/after JSONB snapshots.
- `security_events`: Automated security alert logs.
