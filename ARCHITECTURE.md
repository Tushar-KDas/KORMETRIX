# WORKFORCE 360 — SYSTEM ARCHITECTURE

## 1. Architectural Overview

WorkForce 360 is designed as a unified monorepo multi-tenant SaaS application that serves 5 primary user personas:
1. **Platform Super Admin** (Global operations, SaaS subscriptions, remote configuration engine)
2. **Company Owner / Company Admin** (Full organizational governance, employee lifecycle, branch geofences, policies)
3. **HR / Finance Admin** (Recruitment, leave management, Bangladesh payroll calculations, tax filing)
4. **Department Manager / Team Lead** (Department-scoped review, approval routing, attendance correction, task monitoring)
5. **Employee** (Mobile and web self-service, GPS attendance, leave ledger balance, task checklists, payslips)

```
                                  ┌────────────────────────────────┐
                                  │   Platform Super Admin (Web)   │
                                  └───────────────┬────────────────┘
                                                  │ (Global Remote Config & SaaS)
                                                  ▼
┌─────────────────────────────────┐   ┌────────────────────────────────┐   ┌─────────────────────────────────┐
│     Employee Mobile (Flutter)   │   │    Manager & Admin Web App     │   │   Employee Web Portal (Next.js) │
└────────────────┬────────────────┘   └───────────────┬────────────────┘   └────────────────┬────────────────┘
                 │                                    │                                     │
                 └──────────────────────────────┬─────┴─────────────────────────────────────┘
                                                │ HTTPS / WebSocket Realtime
                                                ▼
                             ┌─────────────────────────────────────┐
                             │       Supabase Backend Gateway      │
                             ├─────────────────────────────────────┤
                             │ • Supabase Auth (JWT & Identity)    │
                             │ • Row Level Security (RLS Engine)   │
                             │ • Realtime Broadcast & Invalidation │
                             │ • Private Object Storage            │
                             │ • Edge Functions (Tax & Webhooks)   │
                             └──────────────────┬──────────────────┘
                                                │
                                                ▼
                             ┌─────────────────────────────────────┐
                             │   PostgreSQL 15 Relational DB       │
                             │ • Tenant-Isolated Schemas           │
                             │ • Immutable Audit Logs              │
                             │ • Geofence Haversine Calculations   │
                             │ • Atomic Leave Balance Ledger       │
                             │ • Locked Historical Payroll Runs    │
                             └─────────────────────────────────────┘
```

---

## 2. Multi-Tenant Isolation Strategy

Tenant isolation is enforced strictly at the database layer through PostgreSQL Row Level Security (RLS):
1. **Tenant Anchor:** Every tenant entity carries an immutable `organization_id UUID REFERENCES organizations(id)`.
2. **Security Definer Helpers:** 
   - `get_user_org_ids()` queries user memberships from `organization_memberships`.
   - `get_org_user_role(org_id)` retrieves the caller's validated role.
   - `get_my_employee_id(org_id)` connects the identity to the employee record.
3. **Defense-in-Depth:**
   - Client requests cannot spoof an `organization_id` because RLS filters against the authenticated `auth.uid()`.
   - Managers cannot see employees outside their assigned `departmentScope` or `branchScope`.
   - Payslip records are sealed so only the employee themselves or designated finance administrators can read them.

---

## 3. Remote Configuration & Device Control Engine

One of WorkForce 360's core innovations is the centralized Remote Configuration Engine:
- **Zero-Code Updates:** Allows administrators to toggle modules (e.g., GPS Geofencing, QR Code attendance, Chat, Performance Reviews) in real-time.
- **Safety Fallbacks:** Client devices cache the last verified valid configuration locally in SQLite / Secure Storage. If network drops or an invalid schema is received, the app continues normal operation safely.
- **Realtime Broadcast:** When an authorized admin publishes a configuration version, Supabase Realtime notifies listening client apps to refresh their active rules without application restarts.
