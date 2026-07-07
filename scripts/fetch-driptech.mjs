// Pull DripTech's OWN images from their WordPress media library → optimised WebP.
// Real branch photos, aerials, product shots, logo and brand marks. Usage: node scripts/fetch-driptech.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../public/assets/', import.meta.url);
await mkdir(OUT, { recursive: true });
const BASE = 'https://driptech.co.zw/wp-content/uploads/';

// [path, name, w, h, mode]   mode: 'cover' (photo) | 'logo' (contain, keep alpha)
const JOBS = [
  // real branch photos
  ['2024/10/glenara-branch-scaled.jpg',            'dt-glenara',     1400, 1000, 'cover'],
  ['2025/04/tynwald.jpg',                          'dt-tynwald',     1400, 1000, 'cover'],
  ['2025/03/waterfalls.jpg',                       'dt-waterfalls',  1400, 1000, 'cover'],
  ['2025/06/marondera.jpg',                        'dt-marondera',   1400, 1000, 'cover'],
  ['2024/12/Pomona-Park-imabe.jpg',                'dt-hararedrive', 1400, 1000, 'cover'],
  ['2023/12/DJI_0580-scaled.jpg',                  'dt-2ndstreet',   1400, 1000, 'cover'],
  ['2023/11/DJI_0676-scaled.jpg',                  'dt-aerial',      1920, 1180, 'cover'],
  // real product shots
  ['2022/01/5000L-Jumbo-Water-Tank-Zimbabwe-new-1.png', 'dt-tanks',  1200, 1400, 'logo'],
  ['2026/02/Drip-Irrigation-Zimbabwe-1.png',       'dt-drip',        1400, 1000, 'cover'],
  // logo + brand marks (transparent, keep alpha)
  ['2025/05/DRIPTECH-30-YEAR-ANNIVERSARY-LOGO-OPT-2-3-1.png', 'dt-logo', 700, 400, 'logo'],
  ['2026/02/Netafim-White-2-1-scaled.png',         'brand-netafim',  520, 200, 'logo'],
  ['2026/02/Rivulis-White-1-scaled.png',           'brand-rivulis',  520, 200, 'logo'],
];

const credits = [];
for (const [path, name, w, h, mode] of JOBS) {
  try {
    const res = await fetch(BASE + path, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    let img = sharp(buf);
    if (mode === 'logo') {
      img = img.resize(w, h, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
    } else {
      img = img.resize(w, h, { fit: 'cover', position: 'attention' });
    }
    await img.webp({ quality: 84 }).toFile(new URL(`${name}.webp`, OUT).pathname);
    credits.push(`${name}.webp ← driptech.co.zw/${path}`);
    console.log(`✓ ${name}.webp  ← ${path}`);
  } catch (e) {
    console.warn(`✗ ${name}: ${e.message}`);
  }
}
await writeFile(new URL('DRIPTECH-IMAGES.txt', OUT), 'DripTech own images (from driptech.co.zw media library)\n\n' + credits.join('\n') + '\n');
console.log(`\nWrote ${credits.length} DripTech images`);
