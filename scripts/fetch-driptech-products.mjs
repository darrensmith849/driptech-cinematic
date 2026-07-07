// Composite DripTech's real (transparent) product cutouts onto ocean-blue cards —
// the way their own site presents products — so they read well on the dark theme.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const OUT = new URL('../public/assets/', import.meta.url);
await mkdir(OUT, { recursive: true });
const BASE = 'https://driptech.co.zw/wp-content/uploads/';
const W = 1500, H = 1000;
const bg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs>` +
  `<radialGradient id="g" cx="50%" cy="32%" r="90%">` +
  `<stop offset="0%" stop-color="#3a97d0"/><stop offset="55%" stop-color="#1d5580"/>` +
  `<stop offset="100%" stop-color="#0e2c43"/></radialGradient></defs>` +
  `<rect width="100%" height="100%" fill="url(#g)"/></svg>`
);

// [source, name]   source: {file} local | {url} remote
const JOBS = [
  [{ file: 'dt-tanks.webp' },                              'prod-tanks'],     // Jumbo Tank
  [{ url: '2022/01/Dura-Silo-Water-Tank-Zimbabwe.png' },   'prod-durasilo'],  // Dura Silo
  [{ url: '2026/02/VALUE-DRIP-1-scaled.png' },             'prod-drip'],      // Value Drip
  [{ url: '2026/02/AGRI-TAPE-1-scaled.png' },              'prod-agritape'],  // Agri Tape
];

const credits = [];
for (const [src, name] of JOBS) {
  try {
    let buf;
    if (src.file) buf = await readFile(new URL(src.file, OUT));
    else {
      const r = await fetch(BASE + src.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      buf = Buffer.from(await r.arrayBuffer());
    }
    let s = sharp(buf);
    try { s = s.trim({ threshold: 12 }); } catch {}
    const prod = await s
      .resize(Math.round(W * 0.58), Math.round(H * 0.82), { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png().toBuffer();
    await sharp(bg).composite([{ input: prod, gravity: 'center' }]).webp({ quality: 86 })
      .toFile(new URL(`${name}.webp`, OUT).pathname);
    credits.push(`${name}.webp ← ${src.file ?? 'driptech.co.zw/' + src.url} (on ocean card)`);
    console.log(`✓ ${name}.webp`);
  } catch (e) {
    console.warn(`✗ ${name}: ${e.message}`);
  }
}
await writeFile(new URL('DRIPTECH-PRODUCTS.txt', OUT), 'DripTech product cards (real cutouts on ocean cards)\n\n' + credits.join('\n') + '\n');
console.log(`\nWrote ${credits.length} product cards`);
