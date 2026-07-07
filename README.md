# DripTech Irrigation — website (cinematic variant)

The **cinematic (dark, film-grade)** take on the DripTech site — an alternative to
the Bold build ([driptech](https://github.com/darrensmith849/driptech)). Built by
CrossCoders on the data-driven **factory-template** (Cinematic skin), deployed to
Cloudflare Pages.

## How it works

The entire site derives from **`src/content.json`** (validated by
`src/lib/content-schema.ts`). Copy, sections, palette (`ocean` water-blue on a dark
theme), fonts and layout are all data.

- `brand.templateKey: "cinematic"`, `brand.theme: "dark"`
- Pages: **Home** (hero · marquee · 9-product Work reel · story · approach ·
  testimonials · CTA · contact) and **Branches** (all 11 branches, addresses + phones)

## Imagery

Licensed **Pexels** irrigation/agriculture pool (dramatic, cinematic), fetched +
optimised to WebP via `scripts/fetch-pexels.mjs` (key in gitignored `.dev.vars`).
Attribution in `public/assets/CREDITS.txt`. Premium placeholders — swap in DripTech's
own product photography when available.

## Local dev

```
npm install
npm run dev        # → localhost:4351 (or --port)
npm run build      # → dist/
wrangler pages deploy dist/ --project-name=driptech-cinematic
```

## Source content

Content, testimonials, product range, and the full 11-branch directory (addresses +
phones) were taken from driptech.co.zw. Verify a central email and hours before launch.
