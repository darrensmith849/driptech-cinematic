// Fetch a moody, cinematic image pool from Pexels → optimized WebP (dark film-studio look).
// Usage: node scripts/fetch-pexels.mjs   (reads PEXELS_API_KEY from .dev.vars or env)
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const KEY = (process.env.PEXELS_API_KEY ||
  (await readFile(new URL('../.dev.vars', import.meta.url), 'utf8').catch(() => ''))
    .match(/PEXELS_API_KEY=(.+)/)?.[1] || '').trim();
if (!KEY) { console.error('No PEXELS_API_KEY found'); process.exit(1); }

const OUT = new URL('../public/assets/', import.meta.url);
await mkdir(OUT, { recursive: true });

// query, output file, width, height, orientation, index
// DripTech — dramatic, cinematic irrigation & water imagery for the dark film-grade skin
const JOBS = [
  ['aerial center pivot irrigation field golden hour', 'hero',  1920, 1180, 'landscape', 0],
  ['sprinkler irrigation water spray sunset backlit',  'w-1',   1200, 1500, 'portrait',  0],
  ['aerial green circle crop fields irrigation',       'w-2',   1600, 1040, 'landscape', 0],
  ['water droplets splash macro dark',                 'w-3',   1200, 1500, 'portrait',  0],
  ['drip irrigation rows crops close up',              'w-4',   1600, 1040, 'landscape', 0],
  ['industrial water pump machine',                    'w-5',   1200, 1500, 'portrait',  0],
  ['vast farmland aerial dramatic landscape',          'w-6',   1600, 1040, 'landscape', 0],
  ['stacked pvc pipes industrial',                     'w-7',   1200, 1500, 'portrait',  0],
  ['large water storage tanks',                        'w-8',   1600, 1040, 'landscape', 0],
  ['borehole water well drilling rig',                 'w-9',   1200, 1500, 'portrait',  0],
  ['african farmers working green field agriculture',  'feature',1600,1040, 'landscape', 0],
  ['irrigation field sunset dramatic sky',             'cta',   1920, 1080, 'landscape', 0],
  ['zimbabwe farmland aerial landscape',               'branches-hero', 1600, 1040, 'landscape', 0],
];

const credits = [];
for (const [q, name, w, h, orientation, idx] of JOBS) {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=6&orientation=${orientation}`;
    const res = await fetch(url, { headers: { Authorization: KEY } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const photo = data.photos?.[idx] ?? data.photos?.[0];
    if (!photo) { console.warn(`✗ ${name}: no results for "${q}"`); continue; }
    const buf = Buffer.from(await (await fetch(photo.src.original)).arrayBuffer());
    await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' })
      .webp({ quality: 82 }).toFile(new URL(`${name}.webp`, OUT).pathname);
    credits.push(`${name}.webp — Photo by ${photo.photographer} (${photo.url})`);
    console.log(`✓ ${name}.webp  ← "${q}" [#${idx}] by ${photo.photographer}`);
  } catch (e) {
    console.warn(`✗ ${name}: ${e.message}`);
  }
}
await writeFile(new URL('CREDITS.txt', OUT), 'DRIPTECH (cinematic) — image credits (Pexels License, free to use)\n\n' + credits.join('\n') + '\n');
console.log(`\nWrote ${credits.length} images + CREDITS.txt`);
