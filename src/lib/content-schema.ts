import { z } from 'zod';

// Multi-page content model — SHARED across the template family (warm, editorial, …). A site is a
// sitemap of PAGES; each page is an ordered list of typed SECTIONS (a discriminated union). Every
// template reads this same schema; a template renders the section types it supports and ignores the
// rest. `brand.templateKey` selects which template (skin) the worker builds with.

export const PALETTE_KEYS = ['ocean', 'forest', 'warm', 'mono', 'berry', 'sun', 'slate'] as const;
export const FONT_PAIR_KEYS = ['jakarta_inter', 'fraunces_inter', 'sora_inter'] as const;
export const TEMPLATE_KEYS = ['warm', 'editorial', 'cinematic'] as const; // the aesthetic family
export const CATEGORY_KEYS = [
  'restaurant', 'trades', 'salon_spa', 'medical', 'auto',
  'retail', 'professional_services', 'fitness', 'accommodation', 'other',
] as const;
export type Category = (typeof CATEGORY_KEYS)[number];

const cta = z.object({ label: z.string(), href: z.string() });
const iconItem = z.object({ icon: z.string().default('sparkles'), label: z.string(), sub: z.string().optional() });

// ─────────────────────────── section variants ───────────────────────────
const hero = z.object({
  type: z.literal('hero'),
  headline: z.string(), subhead: z.string(),
  primaryCta: cta, secondaryCta: cta.optional(),
  highlights: z.array(z.string()).max(5).default([]),
  image: z.string().optional(),
  // editorial extras (optional, ignored by templates that don't use them)
  chips: z.array(z.object({ k: z.string(), v: z.string() })).max(3).default([]),
  trust: z.array(z.string()).max(6).default([]),
});
const pageHeader = z.object({
  type: z.literal('pageHeader'),
  eyebrow: z.string().optional(), title: z.string(), intro: z.string().optional(), image: z.string().optional(),
});
const highlights = z.object({ type: z.literal('highlights'), items: z.array(iconItem).max(4).default([]) });
const services = z.object({
  type: z.literal('services'),
  eyebrow: z.string().optional(), title: z.string().optional(), intro: z.string().optional(),
  items: z.array(z.object({ icon: z.string().default('sparkles'), title: z.string(), blurb: z.string(), href: z.string().optional() })).max(6).default([]),
});
const about = z.object({
  type: z.literal('about'),
  eyebrow: z.string().optional(), heading: z.string(),
  body: z.array(z.string()).default([]), points: z.array(z.string()).max(6).default([]), image: z.string().optional(),
});
const featureSplit = z.object({
  type: z.literal('featureSplit'),
  eyebrow: z.string().optional(), title: z.string(),
  body: z.array(z.string()).default([]), points: z.array(z.string()).max(6).default([]),
  image: z.string().optional(), reverse: z.boolean().default(false),
  images: z.array(z.string()).max(3).default([]),   // >1 → collage render (editorial)
});
const richtext = z.object({
  type: z.literal('richtext'),
  eyebrow: z.string().optional(), title: z.string().optional(),
  body: z.array(z.string()).default([]), align: z.enum(['left', 'center']).default('left'),
});
const gallery = z.object({
  type: z.literal('gallery'),
  eyebrow: z.string().optional(), title: z.string().optional(),
  items: z.array(z.object({ label: z.string().optional(), image: z.string().optional() })).max(12).default([]),
});
const faqs = z.object({
  type: z.literal('faqs'),
  eyebrow: z.string().optional(), title: z.string().optional(), intro: z.string().optional(),
  items: z.array(z.object({ q: z.string(), a: z.string() })).max(10).default([]),
});
const visit = z.object({
  type: z.literal('visit'),
  eyebrow: z.string().optional(), heading: z.string(), intro: z.string().optional(),
  timesLabel: z.string().optional(),
  steps: z.array(z.object({ title: z.string(), detail: z.string() })).max(6).default([]),
});
// editorial: an isolated-product grid with a category filter (the "collection" gallery)
const products = z.object({
  type: z.literal('products'),
  eyebrow: z.string().optional(), title: z.string(),
  imageFit: z.enum(['contain', 'cover']).default('contain'),   // contain=cutouts, cover=photos
  filters: z.array(z.string()).max(6).default([]),
  items: z.array(z.object({
    name: z.string(), category: z.string().optional(), price: z.string().optional(),
    rating: z.number().min(0).max(5).default(5), note: z.string().optional(), image: z.string().optional(),
  })).max(12).default([]),
});
// editorial: a big centred statement, one word emphasised in the accent colour
const statement = z.object({
  type: z.literal('statement'),
  text: z.string(), highlight: z.string().optional(), sub: z.string().optional(),
  marquee: z.array(z.string()).max(8).default([]),
});
// editorial: review cards (use only with real, consented testimonials in production)
const testimonials = z.object({
  type: z.literal('testimonials'),
  eyebrow: z.string().optional(), title: z.string().optional(),
  items: z.array(z.object({ quote: z.string(), name: z.string(), role: z.string().optional(), rating: z.number().min(0).max(5).default(5) })).max(6).default([]),
});
const ctaSection = z.object({ type: z.literal('cta'), heading: z.string(), sub: z.string().optional(), primaryCta: cta, secondaryCta: cta.optional(), phone: z.boolean().default(true), image: z.string().optional() });
const contact = z.object({ type: z.literal('contact'), eyebrow: z.string().optional(), title: z.string().optional(), intro: z.string().optional() });

export const Section = z.discriminatedUnion('type', [
  hero, pageHeader, highlights, services, about, featureSplit, richtext, gallery, faqs, visit,
  products, statement, testimonials, ctaSection, contact,
]);
export type SectionT = z.infer<typeof Section>;
export type SectionType = SectionT['type'];

export const Page = z.object({
  slug: z.string(),
  title: z.string(),
  nav: z.union([z.string(), z.literal(false)]).optional(),
  description: z.string().optional(),
  sections: z.array(Section).default([]),
});
export type PageT = z.infer<typeof Page>;

export const SiteContent = z.object({
  meta: z.object({
    slug: z.string(),
    noindex: z.boolean().default(true),
    generatedAt: z.string().optional(),
    templateVersion: z.string().default('2.0.0'),
  }),
  business: z.object({
    name: z.string(),
    category: z.enum(CATEGORY_KEYS).default('other'),
    tagline: z.string(),
    suburb: z.string().optional(), city: z.string().optional(), province: z.string().optional(),
    address: z.string().optional(),
    phoneDisplay: z.string().optional(), phoneE164: z.string().optional(), whatsapp: z.string().optional(),
    email: z.string().optional(),
    hours: z.array(z.object({ day: z.string(), time: z.string() })).default([]),
    social: z.object({ facebook: z.string().optional(), instagram: z.string().optional() }).default({}),
    mapEmbed: z.string().optional(),
  }),
  brand: z.object({
    templateKey: z.enum(TEMPLATE_KEYS).default('warm'),   // ← selects the aesthetic/skin
    theme: z.enum(['light', 'dark']).default('light'),    // editorial supports both
    paletteKey: z.enum(PALETTE_KEYS).default('ocean'),
    fontPairKey: z.enum(FONT_PAIR_KEYS).default('jakarta_inter'),
    logoMode: z.enum(['wordmark', 'monogram']).default('wordmark'),
    accent: z.string().optional(),                         // optional per-brand accent override
  }),
  headerCta: cta.optional(),
  pages: z.array(Page).min(1),
});

export type SiteContentT = z.infer<typeof SiteContent>;
