# KORMETRIX — PROJECT EXECUTION TRACKER

**System Name:** KORMETRIX  
**Tagline:** People. Work. Performance.  
**Architecture:** Enterprise Monorepo (Next.js 14 Web Portal, Flutter Mobile App, Supabase PostgreSQL & Backend, Shared Packages)  
**Localization:** Bangladesh (Dhaka / BDT ৳ / বাংলা + English)  
**Status Legend:** `NOT STARTED` | `IN PROGRESS` | `IMPLEMENTED` | `TESTED` | `BLOCKED`

---

## 1. Global Rebranding to KORMETRIX (`v2.1.0`)

- **Brand Name:** KORMETRIX
- **Tagline:** People. Work. Performance.
- **Product Family Modules:**
  - **KORMETRIX Control:** Platform Super Admin Dashboard (`/platform-admin`)
  - **Kormetrix Company:** Company Admin Dashboard (`/admin`)
  - **Kormetrix People:** HR Administrator Portal (`/hr`)
  - **Kormetrix Team:** Team Manager Portal (`/manager`)
  - **Kormetrix Desk:** Employee Self-Service Portal (`/employee`)
  - **Kormetrix Go:** Flutter Android & iOS Mobile Application
- **Master Assets:**
  - Vector Geometric K Monogram with Human Silhouette & Orbital Swooshes
  - Primary Wordmark with Vivid Teal Accent on 'X'
  - 1024×1024 Master Squircle App Icon
  - Full Density Android Launcher Mipmaps (`mdpi` to `xxxhdpi`)
  - PWA 192×192 / 512×512 Adaptive Icons & SVG Favicon
- **Brand Management Engine:** `/platform-admin/branding` with live theme swatches, remote asset overrides, validation, publishing, and audit history.

---

## 2. Android Mobile APK Binary Release

- **App Label:** `KORMETRIX`
- **Product Suite:** `Kormetrix Go`
- **Root File Location:** [Kormetrix-v2.1.0.apk](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/Kormetrix-v2.1.0.apk)
- **Legacy Compatibility File:** [WorkForce360-v2.0.0.apk](file:///c:/Users/Gigabyte/.gemini/antigravity/scratch/WorkForce%20360/WorkForce360-v2.0.0.apk)
- **App Version:** `2.1.0+1`
- **Application ID:** `com.workforce360.mobile` (Preserved for compatibility)
- **Target SDK:** Android 36 (Android 14/15/UpsideDownCake ready)
- **Min SDK:** Android 24 (Compatible with 99.4% of Android devices)
- **File Size:** `189.4 MB` (Compiled with official 3D master squircle icon and full-density mipmaps)
- **Key Features Included:**
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

## 3. 5 Teams & 100 Employees Roster

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
