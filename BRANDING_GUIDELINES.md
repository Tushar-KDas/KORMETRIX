# KORMETRIX Global Brand Guidelines
**Official Brand Identity, Typography, Color Palette, and Design Standards**

---

## 1. Brand Essence & Positioning

- **Brand Name:** KORMETRIX
- **Tagline:** *People. Work. Performance.*
- **Category:** Enterprise Workforce Management Platform (HRMS / SaaS / Geofence Attendance)
- **Voice & Tone:** Authoritative, Modern, Enterprise-grade, Empowering, Precise.
- **Mission:** Streamlining people operations, attendance, payroll, and workforce performance across web and mobile platforms with zero friction.

---

## 2. Official Color Palette

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Deep Midnight Navy | `#14243F` | Primary navigation, headers, dark text, authoritative brand framing |
| **Secondary** | Royal Blue | `#3158D8` | Action buttons, primary focus rings, interactive states, links |
| **Accent** | Vivid Cyan / Teal | `#19B89A` | Badges, success indicators, 'X' monogram accent, punch in buttons |
| **Background Light** | Cool Cloud | `#F5F7FB` | Main application background (Light Theme) |
| **Background Dark** | Midnight Black | `#101827` | Main application background (Dark Theme) |
| **Surface** | Pure White | `#FFFFFF` | Cards, modals, data tables (Light Theme) |
| **Surface Dark** | Slate Navy | `#1E293B` | Cards, modals, data tables (Dark Theme) |
| **Text Primary** | Deep Navy Grey | `#17243B` | Primary headings, table text, high-contrast labels |
| **Text Secondary** | Muted Slate | `#667085` | Secondary text, timestamps, captions, helper hints |

---

## 3. Typography Standards

- **Primary Font Family:** Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Monospace Font Family:** JetBrains Mono, Fira Code, Consolas, monospace
- **Scale:**
  - H1 Display: 32px - 40px (Black / Bold 900)
  - H2 Section Header: 24px - 28px (Bold 800)
  - H3 Card Title: 16px - 18px (Bold 700)
  - Body Text: 13px - 14px (Regular 400 / Medium 500)
  - Small / Badges: 10px - 11px (Bold 700 / Semi-Bold 600)

---

## 4. Logo & Monogram Rules

### 4.1 The Geometric K Monogram
- Composed of a geometric structural 'K', an upward rising human silhouette symbolizing employee empowerment, and dual orbital swooshes in vivid teal (`#19B89A`) and royal blue (`#3158D8`).
- Never skew, stretch, or rotate the monogram.
- Minimum clear space equals half the width of the monogram on all four sides.

### 4.2 The KORMETRIX Wordmark
- Written in uppercase sans-serif bold type.
- The letter **X** features an accented right diagonal stroke in Vivid Teal (`#19B89A`) to denote speed, connectivity, and performance metrics.
- Always accompanied by the tagline: *People. Work. Performance.*

### 4.3 Monochrome & Inverted Usage
- **Dark Backgrounds:** Use white wordmark with vibrant monogram (`/logo-white.png`).
- **Light Backgrounds:** Use dark navy wordmark (`/logo.png`).
- **Favicon & Small UI:** Use standalone geometric K symbol (`/kormetrix-symbol.png`).

---

## 5. Mobile App Icon Standards

- **Format:** 1024×1024 Master PNG with squircle curvature (`assets/branding/app-icon/app-icon-master.png`).
- **Android Adaptive Icons:**
  - Background: Solid Midnight Navy (`#14243F`)
  - Foreground: Centered white K monogram with teal orbital swooshes (`108×108dp` safe zone).
- **Densities Generated:**
  - `mipmap-mdpi`: 48×48 px
  - `mipmap-hdpi`: 72×72 px
  - `mipmap-xhdpi`: 96×96 px
  - `mipmap-xxhdpi`: 144×144 px
  - `mipmap-xxxhdpi`: 192×192 px

---

## 6. Product Family & Role Branding

| Sub-Product | Audience / Role | Route / Platform | Description |
| :--- | :--- | :--- | :--- |
| **KORMETRIX Control** | Platform Super Admin | `/platform-admin` | Multi-tenant governance, telemetry, SaaS fleet & remote branding engine |
| **Kormetrix Company** | Company Admin | `/admin` | Single-tenant business operations, branches, and Bangladesh compliance |
| **Kormetrix People** | HR Administrator | `/hr` | People operations, recruitment pipelines, leave approvals & onboarding |
| **Kormetrix Team** | Team Manager | `/manager` | Department rosters, shift geofences, task tracking & approvals |
| **Kormetrix Desk** | Employee Portal | `/employee` | Self-service attendance punches, leave requests, payslips & 3D ID cards |
| **Kormetrix Go** | Mobile App | Flutter (Android/iOS) | Native geofence punch clock, real-time sync, and digital employee wallet |

---

## 7. Tenant vs. Platform Identity Separation

> [!IMPORTANT]
> The platform SaaS brand is strictly **KORMETRIX**. 
> Customer tenant organizations (such as the default enterprise tenant **WorkForce 360 Ltd**) have their own organization name, branch hierarchy (Banani HQ, Gulshan Hub), and tenant branding. Do not conflate the tenant organization's business name with the overarching KORMETRIX platform identity.
