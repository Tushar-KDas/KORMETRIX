# WorkForce 360 — Administrator & Manager Operations Manual

**WorkForce 360** provides unified control over multi-tenant operations, workforce attendance, Bangladesh-compliant payroll, and fleet device management. This manual guides Super Admins, Company Admins, and Managers through day-to-day operations.

---

## 1. Platform Super Admin Portal (`/platform-admin`)

The Platform Super Admin dashboard is the operational cockpit for SaaS platform owners.

### 1.1 Tenant Provisioning
1. Navigate to **Organizations** (`/platform-admin/organizations`).
2. Click **Create New Organization**.
3. Fill in the tenant profile:
   - **Company Name**: e.g., `Innovate BD Ltd`.
   - **Subdomain / Slug**: `innovatebd`.
   - **Industry**: e.g., `Technology & Software`.
   - **Company Admin Email**: `admin@innovatebd.com`.
   - **SaaS Subscription Plan**: Select `Enterprise Plan` (৳ 45,000 / month).
4. Click **Provision Tenant**. The system creates the isolated organization record, initial role bindings, and default leave ledger quotas automatically.

### 1.2 SaaS Subscription & Billing (`/platform-admin/subscriptions`)
- Monitor total Monthly Recurring Revenue (MRR: e.g., **৳ 2,45,000** across active clients).
- Manage subscription tiers (`Starter`, `Growth`, `Enterprise`, `Unlimited`).
- Adjust maximum employee seat caps and storage allowances.

### 1.3 Live Remote Control System (`/platform-admin/remote-control`)
Matches the real-time device control center (as seen in Image 4):
- **Connected Devices**: View active employee smartphones with hardware ID, battery percentage, OS version, and network latency.
- **Live Screen Preview**: Stream mobile screen status for compliance and technical support.
- **Remote Commands**:
  - **Lock Device**: Instantly freezes the employee mobile application session.
  - **Force Update**: Triggers immediate cache invalidation and forces the latest app build.
  - **Wipe Corporate Data**: Purges local SQLite offline punch caches and corporate documents on lost/stolen hardware.
- **Push Broadcast Message**: Send high-priority alert banners directly to all employee device viewports.

---

## 2. Company Admin Portal (`/admin`)

Company Administrators manage the internal human resources, time tracking, and compensation policies.

### 2.1 Branch Geofencing Setup
1. Go to **Settings** -> **Branches & Geofences**.
2. Click **Add Office Branch**.
3. Define the physical perimeter:
   - **Branch Name**: `Dhaka Head Office (Gulshan-1)`.
   - **Latitude**: `23.7925`.
   - **Longitude**: `90.4078`.
   - **Geofence Radius**: `150 meters`.
   - **Enforcement Mode**: `Strict` (reject punches outside radius) or `Flagged` (record with audit flag).

### 2.2 Shift Configuration & Grace Periods
1. Go to **Attendance** -> **Shift Management**.
2. Configure company shifts:
   - **General Shift**: `09:00 AM` to `06:00 PM` (Grace period: `15 minutes`).
   - **Late Punch Penalty**: After 3 late marks in a calendar month, deduct half-day casual leave.
   - **Overtime Threshold**: Work exceeding 9 hours daily auto-accumulates overtime at 1.5x basic hourly rate.

### 2.3 Employee Lifecycle & Onboarding
1. Navigate to **Employees** (`/admin/employees`).
2. Click **Add Employee**.
3. Input employee master data:
   - **Personal**: Name, Email, Bangladesh Mobile (`+88017...`), National ID (NID).
   - **Department & Designation**: Engineering -> Senior Software Engineer.
   - **Reporting Manager**: Assign manager for 2-stage approval routing.
   - **Compensation Structure**: Monthly Gross CTC (e.g., `৳ 85,000`).
   - **Payment Routing**: Bank Account Number, Routing Code, or Mobile Wallet (bKash / Nagad).

### 2.4 Bangladesh Payroll Processing (`/admin/payroll`)
WorkForce 360 includes an automated Bangladesh Labor Act compliant payroll calculation engine:
1. Select the pay cycle (e.g., `April 2025`).
2. Click **Calculate Payroll Runs**.
3. The engine automatically breaks down:
   - **Basic Salary**: 50% of Gross.
   - **House Rent Allowance**: 25% of Gross.
   - **Medical Allowance**: 10% of Gross.
   - **Conveyance Allowance**: 15% of Gross.
   - **Attendance Deductions**: Calculated from verified absent days and late penalties.
   - **Bangladesh Income Tax**: Calculated according to annual progressive tax slabs.
4. Review ledger totals.
5. Click **Finalize Payroll**. Once finalized, the payroll record is cryptographically locked, preventing tampering.
6. Click **Export BEFTN Bank File** to generate the Bangladesh Electronic Funds Transfer Network batch format for direct commercial bank upload (e.g., City Bank, BRAC Bank, Eastern Bank).

---

## 3. Manager Portal (`/manager`)

Managers oversee their assigned direct reports with scoped visibility.

### 3.1 Team Overview & Efficiency Tracking
- Real-time team roster displaying present, absent, on-leave, and field-duty statuses.
- Team Efficiency Metric (e.g., **88%** target vs. actual project completion rate).

### 3.2 Approval Workflows
- **Leave Requests**: Review applicant reason, current balance, and overlapping team leaves before approving.
- **Attendance Corrections / Missing Punches**: Review employee submission evidence (e.g., client visit note) and approve with one click.
- **Expense Claims**: Validate scanned receipt images uploaded to Supabase Storage before routing to Accounts.
