const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const REF_IMAGE = 'C:/Users/Gigabyte/.gemini/antigravity/brain/71a652af-4279-415a-9f0a-63727f1b207f/.user_uploaded/media_1794726470570_6ececdd4.jpg';

async function main() {
  console.log('--- Starting KORMETRIX Brand Asset Generation ---');

  // Ensure directories
  const dirs = [
    'assets/branding/logo',
    'assets/branding/app-icon',
    'assets/branding/favicon',
    'assets/branding/splash',
    'packages/brand-config/src',
    'packages/brand-config/assets',
    'apps/web/public/icons',
    'apps/mobile/assets/images',
    'apps/mobile/android/app/src/main/res/mipmap-mdpi',
    'apps/mobile/android/app/src/main/res/mipmap-hdpi',
    'apps/mobile/android/app/src/main/res/mipmap-xhdpi',
    'apps/mobile/android/app/src/main/res/mipmap-xxhdpi',
    'apps/mobile/android/app/src/main/res/mipmap-xxxhdpi',
  ];
  for (const d of dirs) {
    fs.mkdirSync(d, { recursive: true });
  }

  // 1. Extract K Symbol with transparency
  console.log('[1/7] Extracting K Symbol...');
  const symRaw = await sharp(REF_IMAGE)
    .extract({ left: 125, top: 75, width: 425, height: 257 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const symBuf = Buffer.alloc(symRaw.info.width * symRaw.info.height * 4);
  for (let i = 0; i < symRaw.info.width * symRaw.info.height; i++) {
    const r = symRaw.data[i * 3];
    const g = symRaw.data[i * 3 + 1];
    const b = symRaw.data[i * 3 + 2];
    let a = 255;
    if (r > 240 && g > 240 && b > 240) {
      const minVal = Math.min(r, g, b);
      a = Math.max(0, Math.min(255, Math.round((255 - minVal) * (255 / 15))));
    }
    symBuf[i * 4] = r;
    symBuf[i * 4 + 1] = g;
    symBuf[i * 4 + 2] = b;
    symBuf[i * 4 + 3] = a;
  }

  const kSymbol = await sharp(symBuf, {
    raw: { width: symRaw.info.width, height: symRaw.info.height, channels: 4 }
  }).trim().png().toBuffer();

  fs.writeFileSync('assets/branding/logo/kormetrix-symbol.png', kSymbol);
  fs.writeFileSync('packages/brand-config/assets/kormetrix-symbol.png', kSymbol);
  fs.writeFileSync('apps/web/public/kormetrix-symbol.png', kSymbol);

  // 2. Extract Wordmark with transparency
  console.log('[2/7] Extracting Wordmark...');
  const wmRaw = await sharp(REF_IMAGE)
    .extract({ left: 35, top: 340, width: 520, height: 132 })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const wmBuf = Buffer.alloc(wmRaw.info.width * wmRaw.info.height * 4);
  const wmWhiteBuf = Buffer.alloc(wmRaw.info.width * wmRaw.info.height * 4);

  for (let i = 0; i < wmRaw.info.width * wmRaw.info.height; i++) {
    const r = wmRaw.data[i * 3];
    const g = wmRaw.data[i * 3 + 1];
    const b = wmRaw.data[i * 3 + 2];
    let a = 255;
    if (r > 240 && g > 240 && b > 240) {
      const minVal = Math.min(r, g, b);
      a = Math.max(0, Math.min(255, Math.round((255 - minVal) * (255 / 15))));
    }
    wmBuf[i * 4] = r;
    wmBuf[i * 4 + 1] = g;
    wmBuf[i * 4 + 2] = b;
    wmBuf[i * 4 + 3] = a;

    // White version for dark backgrounds
    const isTeal = (g > 140 && b > 120 && r < 100);
    if (isTeal) {
      wmWhiteBuf[i * 4] = 25; // #19B89A
      wmWhiteBuf[i * 4 + 1] = 184;
      wmWhiteBuf[i * 4 + 2] = 154;
      wmWhiteBuf[i * 4 + 3] = a;
    } else if (a > 10) {
      wmWhiteBuf[i * 4] = 255;
      wmWhiteBuf[i * 4 + 1] = 255;
      wmWhiteBuf[i * 4 + 2] = 255;
      wmWhiteBuf[i * 4 + 3] = a;
    } else {
      wmWhiteBuf[i * 4 + 3] = 0;
    }
  }

  const kWordmark = await sharp(wmBuf, {
    raw: { width: wmRaw.info.width, height: wmRaw.info.height, channels: 4 }
  }).trim().png().toBuffer();

  const kWordmarkWhite = await sharp(wmWhiteBuf, {
    raw: { width: wmRaw.info.width, height: wmRaw.info.height, channels: 4 }
  }).trim().png().toBuffer();

  fs.writeFileSync('assets/branding/logo/kormetrix-wordmark.png', kWordmark);
  fs.writeFileSync('assets/branding/logo/kormetrix-wordmark-white.png', kWordmarkWhite);

  // 3. Composite Horizontal Logo
  console.log('[3/7] Generating Horizontal Logos...');
  const sym160 = await sharp(kSymbol).resize(null, 160).toBuffer();
  const symMeta160 = await sharp(sym160).metadata();
  const wm130 = await sharp(kWordmark).resize(null, 130).toBuffer();
  const wmMeta130 = await sharp(wm130).metadata();
  const wmWhite130 = await sharp(kWordmarkWhite).resize(null, 130).toBuffer();

  const hGap = 24;
  const hW = symMeta160.width + hGap + wmMeta130.width + 32;
  const hH = Math.max(symMeta160.height, wmMeta130.height) + 16;
  const sTop = Math.round((hH - symMeta160.height) / 2);
  const wTop = Math.round((hH - wmMeta130.height) / 2);

  const horizontalLogo = await sharp({
    create: {
      width: hW,
      height: hH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: sym160, left: 16, top: sTop },
    { input: wm130, left: 16 + symMeta160.width + hGap, top: wTop }
  ]).png().toBuffer();

  const horizontalLogoWhite = await sharp({
    create: {
      width: hW,
      height: hH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: sym160, left: 16, top: sTop },
    { input: wmWhite130, left: 16 + symMeta160.width + hGap, top: wTop }
  ]).png().toBuffer();

  fs.writeFileSync('assets/branding/logo/kormetrix-logo.png', horizontalLogo);
  fs.writeFileSync('assets/branding/logo/kormetrix-logo-white.png', horizontalLogoWhite);
  fs.writeFileSync('apps/web/public/logo.png', horizontalLogo);
  fs.writeFileSync('apps/web/public/logo-white.png', horizontalLogoWhite);
  fs.writeFileSync('apps/mobile/assets/images/logo.png', horizontalLogo);
  fs.writeFileSync('packages/brand-config/assets/kormetrix-logo.png', horizontalLogo);

  // 4. Composite Stacked Logo
  console.log('[4/7] Generating Stacked Logo...');
  const sym240 = await sharp(kSymbol).resize(null, 240).toBuffer();
  const symMeta240 = await sharp(sym240).metadata();
  const wm120 = await sharp(kWordmark).resize(null, 120).toBuffer();
  const wmMeta120 = await sharp(wm120).metadata();

  const stW = Math.max(symMeta240.width, wmMeta120.width) + 40;
  const stH = symMeta240.height + 20 + wmMeta120.height + 30;
  const stSx = Math.round((stW - symMeta240.width) / 2);
  const stWx = Math.round((stW - wmMeta120.width) / 2);

  const stackedLogo = await sharp({
    create: {
      width: stW,
      height: stH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([
    { input: sym240, left: stSx, top: 15 },
    { input: wm120, left: stWx, top: 15 + symMeta240.height + 20 }
  ]).png().toBuffer();

  fs.writeFileSync('assets/branding/logo/kormetrix-logo-stacked.png', stackedLogo);
  fs.writeFileSync('assets/branding/splash/splash-logo.png', stackedLogo);
  fs.writeFileSync('apps/mobile/assets/images/splash_logo.png', stackedLogo);

  // 5. Generate Master App Icon & Squircle Icon
  console.log('[5/7] Generating Master App Icon...');
  // The squircle in REF_IMAGE is between x: 605, y: 100, width: 390, height: 390
  const rawIcon = await sharp(REF_IMAGE)
    .extract({ left: 605, top: 100, width: 390, height: 390 })
    .resize(1024, 1024, { fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const squircleBuf = Buffer.alloc(1024 * 1024 * 4);
  for (let y = 0; y < 1024; y++) {
    for (let x = 0; x < 1024; x++) {
      const idx = (y * 1024 + x) * 3;
      const outIdx = (y * 1024 + x) * 4;
      const r = rawIcon.data[idx];
      const g = rawIcon.data[idx + 1];
      const b = rawIcon.data[idx + 2];

      let a = 255;
      const distFromCenter = Math.hypot(x - 512, y - 512);
      if (distFromCenter > 400) {
        if (r > 235 && g > 235 && b > 235) {
          const minVal = Math.min(r, g, b);
          a = Math.max(0, Math.min(255, Math.round((255 - minVal) * (255 / 20))));
        }
      }

      squircleBuf[outIdx] = r;
      squircleBuf[outIdx + 1] = g;
      squircleBuf[outIdx + 2] = b;
      squircleBuf[outIdx + 3] = a;
    }
  }

  const appIcon1024 = await sharp(squircleBuf, {
    raw: { width: 1024, height: 1024, channels: 4 }
  }).png().toBuffer();

  fs.writeFileSync('assets/branding/app-icon/app-icon-master.png', appIcon1024);
  fs.writeFileSync('assets/branding/app-icon/app-icon-squircle.png', appIcon1024);
  fs.writeFileSync('packages/brand-config/assets/app-icon-master.png', appIcon1024);

  // Deploy to Web Public Icon
  fs.writeFileSync('apps/web/public/icon.png', appIcon1024);
  fs.writeFileSync('apps/mobile/assets/images/app_icon.png', appIcon1024);

  // 6. Generate Android Adaptive Icons & Mipmap Densities
  console.log('[6/7] Generating Android Launcher Icons & Adaptive Icons...');
  // Background: Deep Navy/Midnight Blue gradient with subtle radial glow
  const bgSvg = `
  <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#14243F" />
        <stop offset="50%" stop-color="#101827" />
        <stop offset="100%" stop-color="#1E3A8A" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#19B89A" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#14243F" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1024" height="1024" fill="url(#bgGrad)" />
    <circle cx="512" cy="450" r="500" fill="url(#glow)" />
  </svg>
  `;
  const bgBuf = await sharp(Buffer.from(bgSvg)).png().toBuffer();
  fs.writeFileSync('assets/branding/app-icon/app-icon-android-background.png', bgBuf);

  // Foreground: centered clean K symbol
  const fgSym = await sharp(kSymbol).resize(580, 580, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const fgIcon = await sharp({
    create: { width: 1024, height: 1024, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  }).composite([{ input: fgSym, left: 222, top: 222 }]).png().toBuffer();
  fs.writeFileSync('assets/branding/app-icon/app-icon-android-foreground.png', fgIcon);

  // Android mipmap densities:
  const mipmaps = [
    { dir: 'apps/mobile/android/app/src/main/res/mipmap-mdpi', size: 48 },
    { dir: 'apps/mobile/android/app/src/main/res/mipmap-hdpi', size: 72 },
    { dir: 'apps/mobile/android/app/src/main/res/mipmap-xhdpi', size: 96 },
    { dir: 'apps/mobile/android/app/src/main/res/mipmap-xxhdpi', size: 144 },
    { dir: 'apps/mobile/android/app/src/main/res/mipmap-xxxhdpi', size: 192 },
  ];

  for (const m of mipmaps) {
    const resized = await sharp(appIcon1024).resize(m.size, m.size).png().toBuffer();
    fs.writeFileSync(path.join(m.dir, 'ic_launcher.png'), resized);
  }

  // 7. Generate Favicon & PWA Icons
  console.log('[7/7] Generating Favicons & PWA Icons...');
  const icon192 = await sharp(appIcon1024).resize(192, 192).png().toBuffer();
  const icon512 = await sharp(appIcon1024).resize(512, 512).png().toBuffer();
  const appleTouch = await sharp(appIcon1024).resize(180, 180).png().toBuffer();
  const fav32 = await sharp(appIcon1024).resize(32, 32).png().toBuffer();

  fs.writeFileSync('assets/branding/favicon/apple-touch-icon.png', appleTouch);
  fs.writeFileSync('assets/branding/favicon/favicon.ico', fav32);
  fs.writeFileSync('apps/web/public/apple-touch-icon.png', appleTouch);
  fs.writeFileSync('apps/web/public/favicon.ico', fav32);
  fs.writeFileSync('apps/web/public/icons/icon-192.png', icon192);
  fs.writeFileSync('apps/web/public/icons/icon-512.png', icon512);
  fs.writeFileSync('apps/web/public/icons/icon-maskable-512.png', icon512);

  console.log('✅ All KORMETRIX brand image assets generated successfully!');
}

main().catch(err => {
  console.error('Asset generation error:', err);
  process.exit(1);
});
