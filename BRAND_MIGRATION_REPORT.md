# KORMETRIX Global Rebranding & Migration Report
**Executive Technical Summary of Full Brand Overhaul across Web, Mobile, and Infrastructure**

---

## 1. Executive Summary

- **Old Brand Identity:** WorkForce 360
- **New Official Brand Identity:** **KORMETRIX**
- **Tagline:** *People. Work. Performance.*
- **Product Category:** Enterprise Workforce Management Platform
- **Scope of Migration:**
  1. Complete extraction and vectorization of official brand assets (Logo, Geometric K Monogram, Squircle App Icon, Wordmark with Vivid Teal 'X').
  2. Centralized Brand Configuration Package (`@workforce360/brand-config`).
  3. Public Web Landing Page, Navbar, Footer, and PWA Manifest.
  4. Authentication & Master 5-Role Login Screen (`apps/web/app/(auth)/login/page.tsx`).
  5. All 5 Administrative and Self-Service Portals (KORMETRIX Control, Kormetrix Company, Kormetrix People, Kormetrix Team, Kormetrix Desk).
  6. Super Admin Remote Brand Management Engine (`/platform-admin/branding`).
  7. Flutter Mobile App (Android Launcher Mipmaps, Splash Screens, In-app Brand Headers, `KormetrixBrand` class, Settings, and 3D ID Cards).
  8. Zero technical disruption: Database schemas, technical foreign keys, customer tenant organization (`WorkForce 360 Ltd`), and Google Drive File IDs preserved intact.

---

## 2. Asset Generation Details

Using the approved reference composite graphic (`media_1794726470570_6ececdd4.jpg`), standalone production-grade assets were extracted and generated:
- **Horizontal Primary Logo:** 847 × 180 px (`/logo.png`, `/logo-white.png`).
- **Geometric K Monogram:** Vector SVG + 360 × 257 px PNG (`/kormetrix-symbol.png`).
- **Squircle App Icon:** Master 1024 × 1024 px PNG (`/icon.png`), squircle radius with deep midnight navy background (`#14243F`), royal blue gradient (`#3158D8`), and vivid teal orbital swooshes (`#19B89A`).
- **Android Adaptive Launchers:** Full density set (`mipmap-mdpi`, `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`).
- **PWA Icons:** 192 × 192 px and 512 × 512 px maskable adaptive icons.
- **Browser Favicons:** Multi-resolution `favicon.ico`, modern `favicon.svg`, and `apple-touch-icon.png`.

---

## 3. Web & Mobile Architecture Updates

### 3.1 Centralized Brand Configuration Engine
- Path: `packages/brand-config`
- Exports:
  - `BRAND_NAME = "KORMETRIX"`
  - `BRAND_TAGLINE = "People. Work. Performance."`
  - `BRAND_COLORS`: `#14243F` (Primary), `#3158D8` (Secondary), `#19B89A` (Accent), `#F5F7FB` (Light BG), `#101827` (Dark BG).
  - Web adapter: `apps/web/lib/brand-config.ts`
  - Flutter adapter: `apps/mobile/lib/core/brand/brand_config.dart`

### 3.2 Platform Super Admin Brand Management Module
- Route: `/platform-admin/branding`
- Capabilities:
  - **Section A:** Live Brand Overview and Active Swatches.
  - **Section B:** Real-time Name, Short Name, Tagline, and Description inputs.
  - **Section C:** Logo asset management with live light/dark mode previews.
  - **Section D:** Application icon gallery and native binary rebuild notice.
  - **Section E:** Interactive color pickers and live simulated UI mockup.
  - **Section F:** Audit trail with version rollback to default official KORMETRIX configuration.

### 3.3 Flutter Mobile Application (`apps/mobile`)
- App Display Name: **KORMETRIX** (configured in `AndroidManifest.xml`).
- Package description updated in `pubspec.yaml`.
- Main widget renamed to `KormetrixApp` in `lib/main.dart`.
- Vector fallback monogram and brand logo component updated in `lib/core/widgets/brand_logo.dart`.
- Employee 3D ID Card rendered with K monogram and KORMETRIX brand header.
- Settings dialog updated with KORMETRIX v2.1.0 and `support@kormetrix.com`.

---

## 4. Integrity and Zero-Regression Guarantees

1. **Database & Supabase:** No tables, rows, or user passwords were dropped. Existing employee accounts and attendance records are fully preserved.
2. **Tenant Separation:** Customer tenant company `WorkForce 360 Ltd` (Banani Corporate HQ, Dhaka) remains the active enterprise tenant inside the multi-tenant architecture, clearly distinguished from the global platform brand **KORMETRIX**.
3. **APK Download Link:** Preserved Google Drive file link (`169QtVxLq1k56stvIEDHxGMs8f0vG42UZ`) ensuring uninterrupted mobile APK deployment.
4. **Vercel Deployments:** Zero TypeScript build errors across all static and dynamic Next.js routes.
