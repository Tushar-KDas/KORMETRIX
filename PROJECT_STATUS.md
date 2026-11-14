# WORKFORCE 360 — PROJECT EXECUTION TRACKER

**System Name:** WorkForce 360  
**Tagline:** One Platform. Complete Workforce Control.  
**Architecture:** Enterprise Monorepo (Next.js 14 Web Portal, Flutter Mobile App, Supabase PostgreSQL & Backend, Shared Packages)  
**Localization:** Bangladesh (Dhaka / BDT ৳ / বাংলা + English)  
**Status Legend:** `NOT STARTED` | `IN PROGRESS` | `IMPLEMENTED` | `TESTED` | `BLOCKED`

---

## 1. Android Mobile APK Binary Release

- **APK File Name:** `WorkForce360-v2.0.0.apk`
- **Root File Location:** [WorkForce360-v2.0.0.apk](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/WorkForce360-v2.0.0.apk)
- **Build Output Location:** [app-debug.apk](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/apps/mobile/build/app/outputs/flutter-apk/app-debug.apk)
- **App Version:** `2.0.0+1`
- **Application ID:** `com.workforce360.mobile`
- **Target SDK:** Android 36 (Android 14/15/UpsideDownCake ready)
- **Min SDK:** Android 24 (Compatible with 99.4% of Android devices)
- **File Size:** `187.38 MB` (Debug package with all offline assets, icons, fonts & offline DB)
- **Key Features Included in APK:**
  - 10 UI Screens matching pixel-perfect uploaded reference design
  - 5 Department Teams & 100 Employees Directory (`/teams`)
  - Both-Side Smart ID Card with 3D Flip animation & Bluetooth/WiFi printing (`/idcard`)
  - Geofence Biometric Check In / Out (`/attendance`)
  - Apply Leave Portal with dynamic leave balance deduction (`/leave`)
  - My Tasks with real-time interactive checkboxes (`/tasks`)
  - Analytics Curve Chart (`/analytics`)
  - Settings, Theme & Language Toggle (`/settings`)
  - Side Navigation Drawer & Admin Credentials Vault

---

## 2. 5 Teams & 100 Employees Roster

| Team ID | Department Name | Squad Lead | Member Count | ID Range | Status |
|---|---|---|---|---|---|
| **engineering** | Engineering & Technology | Tanvir Hasan (Engineering Director) | 25 Staff | `WF-1001` – `WF-1025` | TESTED |
| **design** | Product, UI/UX & Design | Sadia Islam (Head of Product Design) | 20 Staff | `WF-1026` – `WF-1045` | TESTED |
| **hr** | Human Resources & Talent Operations | Nusrath Jahan (Chief People Officer) | 18 Staff | `WF-1046` – `WF-1063` | TESTED |
| **finance** | Finance, Payroll & Accounts | Kamrul Ahsan (CFO / Finance Director) | 17 Staff | `WF-1064` – `WF-1080` | TESTED |
| **sales** | Sales, Marketing & Customer Success | Asif Iqbal (VP of Sales & Growth) | 20 Staff | `WF-1081` – `WF-1100` | TESTED |
| **TOTAL** | **5 Full Departments** | **5 Squad Leads** | **100 Employees** | **WF-1001 – WF-1100** | **100% VERIFIED** |

---

## 3. Web & Mobile Parity

- **Double-Sided ID Card:** Web modal with `@media print` CSS + Flutter 3D flip card.
- **Admin Credentials Vault:** 100 employee login details visible to Super Admin and Company Admin.
- **Role Access Guard:** 403 Forbidden screen prevents unauthorized access to `/platform-admin` and `/admin`.
