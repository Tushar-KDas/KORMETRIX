# KORMETRIX
### People. Work. Performance.
**Enterprise Workforce Management Platform & Multi-Tenant SaaS Ecosystem**

![KORMETRIX](https://img.shields.io/badge/Brand-KORMETRIX-14243F.svg)
![Version](https://img.shields.io/badge/Version-2.1.0-3158D8.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)
![Flutter](https://img.shields.io/badge/Flutter-3.50.0-02569B.svg)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015-3ECF8E.svg)
![Accent](https://img.shields.io/badge/Accent-%2319B89A-19B89A.svg)
![Localization](https://img.shields.io/badge/Localization-Bangladesh%20(BDT%20৳)-16A389.svg)
![License](https://img.shields.io/badge/License-Commercial-17243B.svg)

---

## 1. Executive Summary

**KORMETRIX** is a modern, production-oriented, multi-tenant SaaS Enterprise Workforce Management Platform and Human Resource Management System (HRMS) designed for enterprises operating in Bangladesh and global emerging markets. It bridges mobile frontline workers and corporate leadership through a single unified architecture.

### Official Brand Identity
- **Brand Name:** KORMETRIX
- **Tagline:** *People. Work. Performance.*
- **Colors:** Deep Midnight Navy (`#14243F`), Royal Blue (`#3158D8`), Vivid Teal (`#19B89A`), Cool Cloud Light (`#F5F7FB`), Midnight Dark (`#101827`).
- **Brand Monogram:** Geometric structural 'K' with upward human empowerment silhouette and dual cyan/teal orbital swooshes.

### Product Family & Role Portals
1. **KORMETRIX Control (Platform Super Admin):** Multi-tenant SaaS governance, subscription tier management, live device fleet control, and the **Remote Brand Management Engine** (`/platform-admin/branding`).
2. **Kormetrix Company (Company Admin):** Enterprise operations, 100-employee directory, branches, shift geofences, and Bangladesh tax-compliant payroll engine.
3. **Kormetrix People (HR Admin):** People operations, recruitment tracking pipeline, talent onboarding checklist, and leave management.
4. **Kormetrix Team (Team Manager):** Department team rosters, shift schedules, task boards, and attendance monitoring.
5. **Kormetrix Desk (Employee Portal):** Geofenced attendance punch, 3D flip digital ID card, BDT payslips, and self-service leave requests.
6. **Kormetrix Go (Flutter Mobile App):** Native Android & iOS client featuring biometric verification, offline sync, and real-time push alerts.

---

## 2. Monorepo Architecture

```
kormetrix/
├── apps/
│   ├── mobile/              # Flutter 3.50+ Android & iOS App (Kormetrix Go)
│   └── web/                 # Next.js 14 App Router (Landing, Auth, 5 Role Dashboards)
├── packages/
│   ├── brand-config/        # Centralized KORMETRIX brand tokens, colors & asset resolvers
│   ├── shared-types/        # Universal TypeScript interfaces and data models
│   ├── design-tokens/       # Enterprise color tokens, typography, radii, formatBDT()
│   ├── permission-engine/   # Multi-tenant RBAC, departmental scoping, and confidentiality rules
│   ├── validation/          # Zod schemas for all mutations, attendance GPS, and leave requests
│   └── api-contracts/       # Standardized ApiResponse, error codes, and pagination envelopes
├── supabase/
│   ├── migrations/          # Sequential PostgreSQL SQL migrations with strict RLS
│   └── seed/                # Multi-tenant Bangladesh enterprise fixtures and demo profiles
├── assets/
│   └── branding/            # Master SVGs, PNGs, squircle app icons, favicons & splash logos
├── scripts/
│   ├── generate-all-brand-assets.js # Automated asset generation & slicing pipeline
│   ├── test-packages.js     # Automated business rule and permission tests
│   └── security-audit.js    # Automated RLS policy and credential leak scanner
└── docs/                    # Full technical documentation suite
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

# Build shared TypeScript packages & brand-config
npm run build:packages
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Run Automated Tests & Build
```bash
# Test shared packages and validation schemas
npm test

# Verify production Next.js build
npm run build
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
| **Public Landing Page** | `/` | Product overview, pricing, solutions, and 5-role quick portal gateway |
| **Unified Authentication** | `/login` | Enterprise authentication with 5-role switcher |
| **KORMETRIX Control** | `/platform-admin` | Global SaaS management, MRR KPIs, and Remote Device Control |
| **Brand Management Engine** | `/platform-admin/branding` | Over-the-air brand colors, logo overrides, and version publishing |
| **Kormetrix Company** | `/admin` | Single-tenant business operations, branches, and attendance hierarchy |
| **Kormetrix People** | `/hr` | People operations, recruitment pipelines, and leave approvals |
| **Kormetrix Team** | `/manager` | Department-scoped team overview, shift rosters, and task boards |
| **Kormetrix Desk** | `/employee` | Daily punch, personal leave balance ledger, and 3D digital ID card |

---

## 5. Brand Documentation

For comprehensive brand guidelines and asset manifests, refer to:
- **[Brand Guidelines](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/BRANDING_GUIDELINES.md)**
- **[Brand Asset Manifest](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/BRAND_ASSET_MANIFEST.md)**
- **[Brand Migration Report](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/BRAND_MIGRATION_REPORT.md)**
- **[Brand Configuration Developer Guide](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/BRAND_CONFIGURATION_GUIDE.md)**
- **[Project Milestone Tracker](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/PROJECT_STATUS.md)**

---

## 6. License
Commercial enterprise license. Developed by KORMETRIX Core Architecture Team.
