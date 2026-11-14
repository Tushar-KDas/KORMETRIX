# WORKFORCE 360
### One Platform. Complete Workforce Control.
**Enterprise HRMS & Multi-Tenant Workforce Management SaaS Ecosystem**

![WorkForce 360](https://img.shields.io/badge/Version-2.0.0-3758D8.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![Flutter](https://img.shields.io/badge/Flutter-3.50.0-02569B.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E.svg)
![Localization](https://img.shields.io/badge/Localization-Bangladesh%20(BDT%20৳)-16A389.svg)
![License](https://img.shields.io/badge/License-Commercial-17243B.svg)

---

## 1. Executive Summary

**WorkForce 360** is a production-oriented, multi-tenant SaaS Enterprise Human Resource Management System (HRMS) and Workforce Control ecosystem designed for companies operating in Bangladesh and global emerging markets. It bridges mobile frontline workers and corporate leadership through a single unified architecture.

### Key Capabilities
- **Four Integrated Experiences:**
  1. **Employee Mobile App (Flutter Android/iOS):** Geofenced GPS attendance, self-service leave, itemized BDT payslips, task tracker, and biometric local security.
  2. **Employee Web Portal (Next.js):** Personal desktop dashboard, leave calendar, time-tracking, and document hub.
  3. **Manager Portal (Next.js):** Scoped departmental overview, 2-stage approval queue, and team efficiency metrics.
  4. **Company Admin Dashboard (Next.js):** Complete employee lifecycle, rotating shifts, attendance corrections, and Bangladesh payroll calculation engine.
  5. **Platform Super Admin Dashboard (Next.js):** SaaS tenant provisioning, subscription tier gating, forensic audit logging, and **Live Remote Device Control**.
- **Remote Configuration Engine:** Centralized over-the-air feature flagging, maintenance toggles, remote app locking, and UI configuration without releasing a new APK.
- **Bangladesh Localization:** Native support for BDT (৳), Bangladesh Finance Act progressive tax slabs, Dhaka timezone (`Asia/Dhaka`), Bangla/English dual-language support, and standard Friday/Saturday weekend policies.

---

## 2. Monorepo Architecture

```
workforce360/
├── apps/
│   ├── mobile/              # Flutter 3.50+ Android & iOS Employee Self-Service App
│   └── web/                 # Next.js 14 App Router (Public, Auth, Employee, Manager, Admin, Platform)
├── packages/
│   ├── shared-types/        # Universal TypeScript interfaces and data models
│   ├── design-tokens/       # Enterprise color tokens, typography, radii, formatBDT()
│   ├── permission-engine/   # Multi-tenant RBAC, departmental scoping, and confidentiality rules
│   ├── validation/          # Zod schemas for all mutations, attendance GPS, and leave requests
│   └── api-contracts/       # Standardized ApiResponse, error codes, and pagination envelopes
├── supabase/
│   ├── migrations/          # 12 Sequential PostgreSQL SQL migrations with strict RLS
│   └── seed/                # Multi-tenant Bangladesh enterprise fixtures and demo profiles
├── scripts/
│   ├── test-packages.js     # Automated business rule and permission tests
│   └── security-audit.js    # Automated RLS policy and credential leak scanner
├── docs/                    # Full technical documentation suite
└── .github/workflows/       # Automated CI/CD pipeline
```

---

## 3. Quick Start & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher
- **npm:** v9.0.0 or higher
- **Flutter SDK:** v3.22.0 or higher
- **Java JDK:** 17+ (for Android builds)

### 1. Installation
Clone the repository and install all dependencies:
```bash
# Install root and workspace dependencies
npm install

# Build shared TypeScript packages
npm run build:packages
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env.local
```

### 3. Run Automated Tests
Execute the comprehensive test suites:
```bash
# Test shared packages, RBAC scoping, and validation schemas
node scripts/test-packages.js

# Execute security and RLS policy audit
node scripts/security-audit.js

# Run Flutter mobile automated widget tests
cd apps/mobile && flutter test
```

### 4. Run Development Servers
```bash
# Start Next.js Web Portals (localhost:3000)
npm run dev

# Run Flutter Mobile App (Android/iOS)
cd apps/mobile && flutter run
```

---

## 4. Role-Based Portals Access

| Portal | Default URL | Purpose |
|--------|-------------|---------|
| **Public Landing Page** | `/` | Product overview, pricing, and login gateway |
| **Authentication** | `/login` | Enterprise login with quick role switcher demo |
| **Platform Super Admin** | `/platform-admin` | Global SaaS management, MRR KPIs, and Remote Device Control |
| **Remote Control System** | `/platform-admin/remote-control` | Device locks, screen preview, broadcast messages, and feature flags |
| **Company Admin** | `/admin` | Organization HRMS, employee lifecycle, and attendance administration |
| **Payroll Administration** | `/admin/payroll` | Bangladesh tax calculations, salary disbursements, and PDF payslips |
| **Manager Portal** | `/manager` | Department-scoped team overview, attendance rate, and leave approvals |
| **Employee Web Portal** | `/employee` | Daily punch, personal leave balance ledger, and assigned tasks |

---

## 5. Security & Tenant Isolation

- **Supabase PostgreSQL Row Level Security (RLS):** Enabled across all tenant tables. Every query automatically verifies tenant membership via `auth.uid()`.
- **Confidential Payslip Isolation:** Strict database policies and backend guards ensure employees can **only** inspect their own salary records.
- **Remote Lock Guard:** Allows immediate session termination and device locking from the Super Admin panel in case of lost employee hardware.

---

## 6. Enterprise Documentation Suite

Detailed architectural, security, deployment, and operational manuals:
- **[Architecture & Design Specification](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/ARCHITECTURE.md)**
- **[Database Schema & Migration Index](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/DATABASE_SCHEMA.md)**
- **[Security Architecture & RLS Matrix](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/SECURITY.md)**
- **[API Specification & Endpoints](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/API_DOCUMENTATION.md)**
- **[Supabase Cloud Setup & Migration Runbook](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/SUPABASE_SETUP.md)**
- **[Mobile Application Build & Release Guide](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/MOBILE_BUILD_GUIDE.md)**
- **[Web Application Production Deployment Guide](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/WEB_DEPLOYMENT_GUIDE.md)**
- **[Third-Party Integrations Guide (FCM, Payment & SMS Gateways)](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/INTEGRATION_GUIDE.md)**
- **[Administrator & Manager Operations Manual](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/ADMIN_USER_GUIDE.md)**
- **[Automated Testing & Security Verification Report](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/TESTING_REPORT.md)**
- **[Project Milestone Execution Tracker](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/PROJECT_STATUS.md)**

---

## 7. Deliverables & Build Artifacts

Production build artifacts are staged in the `build-output/` directory:
- **Android Debug APK**: [workforce360-debug.apk](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/build-output/workforce360-debug.apk) (162 MB, SHA256 verified)
- **Build Verification Summary**: [verification-summary.json](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/build-output/verification-summary.json)

---

## 8. License
Commercial enterprise license. Developed by WorkForce 360 Architecture Team.
