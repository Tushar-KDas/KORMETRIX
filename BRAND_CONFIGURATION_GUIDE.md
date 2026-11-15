# KORMETRIX Brand Configuration & Developer Guide
**How to Reference, Customize, and Maintain KORMETRIX Branding Across Codebases**

---

## 1. Web Application (`apps/web`)

### 1.1 Importing Brand Configuration
Always import from `@/lib/brand-config`:

```typescript
import { BRAND_CONFIG, BRAND_COLORS, PRODUCT_MODULES } from '@/lib/brand-config';

// Example: Display Brand Name & Tagline
<h1>{BRAND_CONFIG.name}</h1>
<p>{BRAND_CONFIG.tagline}</p>

// Example: Accessing Module Labels
console.log(PRODUCT_MODULES.control.name); // "KORMETRIX Control"
console.log(PRODUCT_MODULES.company.name); // "Kormetrix Company"
```

### 1.2 Using Official Brand Assets
All web brand assets reside in `apps/web/public/`:

```tsx
// Primary Logo (Light Backgrounds)
<img src="/logo.png" alt="KORMETRIX Logo" className="h-10 object-contain" />

// White Logo (Dark Headers / Hero Sections)
<img src="/logo-white.png" alt="KORMETRIX Logo" className="h-10 object-contain" />

// Standalone Geometric K Monogram
<img src="/kormetrix-symbol.png" alt="KORMETRIX Symbol" className="w-8 h-8 object-contain" />

// App Icon (Squircle)
<img src="/icon.png" alt="KORMETRIX App Icon" className="w-12 h-12 rounded-2xl" />
```

### 1.3 Tailwind Brand Color Classes
- Midnight Navy (Primary): `#14243F` (e.g. `bg-[#14243F]`, `text-[#14243F]`)
- Royal Blue (Secondary): `#3158D8` (e.g. `bg-[#3158D8]`, `text-[#3158D8]`)
- Vivid Teal (Accent): `#19B89A` (e.g. `bg-[#19B89A]`, `text-[#19B89A]`)

---

## 2. Flutter Mobile Application (`apps/mobile`)

### 2.1 Importing Brand Configuration
Import `brand_config.dart` from the core brand module:

```dart
import 'package:mobile/core/brand/brand_config.dart';

// Brand Constants
Text(KormetrixBrand.brandName); // "KORMETRIX"
Text(KormetrixBrand.brandTagline); // "People. Work. Performance."

// Primary Color Palette
Container(color: KormetrixBrand.primaryColor); // Color(0xFF14243F)
```

### 2.2 Using Flutter Brand Widgets
Use `BrandLogo` from `package:mobile/core/widgets/brand_logo.dart`:

```dart
// Stacked Logo with Monogram & Subtitle
BrandLogo(size: 72, showSubtitle: true)

// Compact Logo for App Bars
BrandLogo(size: 32, showSubtitle: false)
```

### 2.3 Mobile Asset Directory Structure
- `apps/mobile/assets/images/logo.png` - Horizontal In-app Logo
- `apps/mobile/assets/images/app_icon.png` - Squircle App Icon
- `apps/mobile/assets/images/splash_logo.png` - Launch Splash Graphic

---

## 3. Remote Brand Management Engine (`/platform-admin/branding`)

The root Super Admin can update brand configurations dynamically via the web dashboard at `/platform-admin/branding`.
- **LocalStorage Key:** `kormetrix_remote_brand_config`
- **Fallback Guarantee:** If remote configuration is unavailable or corrupted, the system automatically falls back to bundled local assets in `DEFAULT_BRAND_CONFIG` to prevent broken UI states.
- **Audit Logging:** Every published configuration change logs timestamp, author, version, and modified fields into the platform audit table.
