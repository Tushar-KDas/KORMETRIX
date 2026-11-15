const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcImage = 'C:/Users/Gigabyte/.gemini/antigravity/brain/71a652af-4279-415a-9f0a-63727f1b207f/.user_uploaded/media_1794730409051_f9655a8a.jpg';

async function generateAll() {
  console.log('Processing uploaded master icon:', srcImage);

  // 1. Create a clean squircle mask with transparent outer corners
  // SVG rounded rect mask with exact curvature of standard squircle (rx=225 on 1024)
  const maskSvg = `<svg width="1024" height="1024">
    <rect x="24" y="24" width="976" height="976" rx="225" ry="225" fill="#ffffff"/>
  </svg>`;

  const maskedBuffer = await sharp(srcImage)
    .resize(1024, 1024)
    .composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Save master icon (1024x1024)
  await sharp(maskedBuffer).toFile('assets/branding/app-icon/app-icon-master.png');
  await sharp(maskedBuffer).toFile('packages/brand-config/assets/app-icon-master.png');
  console.log('[OK] Saved master 1024x1024 icons');

  // Save squircle versions
  await sharp(maskedBuffer).resize(512, 512).toFile('assets/branding/app-icon/app-icon-squircle.png');
  await sharp(maskedBuffer).resize(512, 512).toFile('apps/web/public/icon.png');
  await sharp(maskedBuffer).resize(512, 512).toFile('apps/mobile/assets/images/app_icon.png');
  await sharp(maskedBuffer).resize(512, 512).toFile('apps/mobile/assets/images/splash_logo.png');
  console.log('[OK] Saved 512x512 app icons and splash');

  // PWA manifest icons
  await sharp(maskedBuffer).resize(192, 192).toFile('apps/web/public/icons/icon-192.png');
  await sharp(maskedBuffer).resize(512, 512).toFile('apps/web/public/icons/icon-512.png');
  await sharp(srcImage).resize(512, 512).png().toFile('apps/web/public/icons/icon-maskable-512.png');
  await sharp(maskedBuffer).resize(180, 180).toFile('apps/web/public/apple-touch-icon.png');
  console.log('[OK] Saved web PWA icons');

  // Android mipmap densities
  const mipmaps = [
    { dir: 'mipmap-mdpi', size: 48 },
    { dir: 'mipmap-hdpi', size: 72 },
    { dir: 'mipmap-xhdpi', size: 96 },
    { dir: 'mipmap-xxhdpi', size: 144 },
    { dir: 'mipmap-xxxhdpi', size: 192 },
  ];

  for (const m of mipmaps) {
    const targetDir = path.join('apps/mobile/android/app/src/main/res', m.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    const targetFile = path.join(targetDir, 'ic_launcher.png');
    await sharp(maskedBuffer).resize(m.size, m.size).png().toFile(targetFile);
    console.log(`[OK] Saved Android mipmap: ${targetFile} (${m.size}x${m.size})`);
  }

  // Favicon (48x48)
  await sharp(maskedBuffer).resize(48, 48).png().toFile('apps/web/public/favicon.ico');
  console.log('[OK] Saved favicon.ico');

  console.log('All icons successfully updated!');
}

generateAll().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
