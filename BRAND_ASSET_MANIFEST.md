# KORMETRIX Brand Asset Manifest
**Comprehensive Directory of All Extracted & Generated Brand Assets**

---

## 1. Primary Vector & Raster Logos

| Asset Path | Format | Dimensions | Purpose |
| :--- | :--- | :--- | :--- |
| `assets/branding/logo/kormetrix-logo.png` | PNG | 847 × 180 px | Primary horizontal logo for light backgrounds |
| `assets/branding/logo/kormetrix-logo-white.png` | PNG | 847 × 180 px | Primary horizontal logo for dark backgrounds |
| `assets/branding/logo/kormetrix-symbol.png` | PNG | 360 × 257 px | Geometric K Monogram with upward figure & teal swoosh |
| `assets/branding/logo/kormetrix-wordmark.png` | PNG | 487 × 68 px | Standalone KORMETRIX wordmark (navy with teal 'X') |
| `assets/branding/logo/kormetrix-wordmark-white.png` | PNG | 487 × 68 px | Inverted white KORMETRIX wordmark |
| `assets/branding/logo/kormetrix-logo-stacked.png` | PNG | 512 × 512 px | Stacked icon-above-wordmark layout |
| `assets/branding/logo/kormetrix-logo.svg` | SVG | Scalable Vector | Production vector horizontal logo |
| `assets/branding/logo/kormetrix-symbol.svg` | SVG | Scalable Vector | Production vector K monogram |
| `apps/web/public/logo.png` | PNG | 847 × 180 px | Next.js web public primary logo |
| `apps/web/public/logo-white.png` | PNG | 847 × 180 px | Next.js web public dark mode logo |
| `apps/web/public/kormetrix-symbol.png` | PNG | 360 × 257 px | Next.js web public monogram symbol |
| `apps/mobile/assets/images/logo.png` | PNG | 847 × 180 px | Flutter mobile in-app header logo |

---

## 2. Application Icons & Adaptive Launchers

| Asset Path | Format | Dimensions | Platform / Destination |
| :--- | :--- | :--- | :--- |
| `assets/branding/app-icon/app-icon-master.png` | PNG | 1024 × 1024 px | Master high-resolution app icon |
| `assets/branding/app-icon/app-icon-squircle.png` | PNG | 390 × 390 px | Squircle app icon extracted from approved reference |
| `assets/branding/app-icon/app-icon-android-background.png` | PNG | 432 × 432 px | Android adaptive icon background (`#14243F`) |
| `assets/branding/app-icon/app-icon-android-foreground.png` | PNG | 432 × 432 px | Android adaptive icon foreground (K monogram) |
| `apps/web/public/icon.png` | PNG | 512 × 512 px | Next.js web application icon |
| `apps/mobile/assets/images/app_icon.png` | PNG | 512 × 512 px | Flutter mobile in-app icon asset |
| `apps/mobile/android/app/src/main/res/mipmap-mdpi/ic_launcher.png` | PNG | 48 × 48 px | Android launcher icon (Medium density) |
| `apps/mobile/android/app/src/main/res/mipmap-hdpi/ic_launcher.png` | PNG | 72 × 72 px | Android launcher icon (High density) |
| `apps/mobile/android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` | PNG | 96 × 96 px | Android launcher icon (Extra High density) |
| `apps/mobile/android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` | PNG | 144 × 144 px | Android launcher icon (Extra Extra High density) |
| `apps/mobile/android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` | PNG | 192 × 192 px | Android launcher icon (Ultra High density) |

---

## 3. Web Favicons & PWA Manifest Assets

| Asset Path | Format | Dimensions | Description |
| :--- | :--- | :--- | :--- |
| `assets/branding/favicon/favicon.ico` | ICO | Multi-res | Standard browser favicon |
| `assets/branding/favicon/favicon.svg` | SVG | Scalable Vector | Modern SVG favicon for high-DPI browser tabs |
| `assets/branding/favicon/apple-touch-icon.png` | PNG | 180 × 180 px | iOS Home Screen bookmark icon |
| `apps/web/public/favicon.ico` | ICO | Multi-res | Root Next.js favicon |
| `apps/web/public/favicon.svg` | SVG | Scalable Vector | Root Next.js SVG favicon |
| `apps/web/public/apple-touch-icon.png` | PNG | 180 × 180 px | Root Next.js Apple touch icon |
| `apps/web/public/icons/icon-192.png` | PNG | 192 × 192 px | Progressive Web App manifest icon |
| `apps/web/public/icons/icon-512.png` | PNG | 512 × 512 px | Progressive Web App manifest icon (High-Res) |
| `apps/web/public/icons/icon-maskable-512.png` | PNG | 512 × 512 px | Android PWA maskable adaptive icon |
| `apps/web/public/manifest.json` | JSON | N/A | PWA manifest configured for KORMETRIX |

---

## 4. Mobile Splash Screens

| Asset Path | Format | Dimensions | Purpose |
| :--- | :--- | :--- | :--- |
| `assets/branding/splash/splash-logo.png` | PNG | 512 × 512 px | High-resolution mobile splash screen logo |
| `apps/mobile/assets/images/splash_logo.png` | PNG | 512 × 512 px | Flutter launch splash screen asset |

---

## 5. Verification Checklist

- [x] All PNG files verified for valid headers, RGBA transparency, and exact pixel boundaries.
- [x] All SVG files contain clean path coordinates with zero raster artifacting.
- [x] All Android mipmaps placed in standard `android/app/src/main/res/` directories.
- [x] All PWA and web icons declared in `manifest.json` and `apps/web/app/layout.tsx`.
- [x] Fallback vector rendering implemented in Flutter `brand_logo.dart` and web components.
