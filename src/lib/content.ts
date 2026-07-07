import raw from '../content.json';
import { SiteContent, type SiteContentT } from './content-schema';

// Parsed + validated once at build time. Malformed content.json throws here and fails the build.
export const content: SiteContentT = SiteContent.parse(raw);
export const business = content.business;
export const brand = content.brand;

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Nav: multi-page sites use page nav labels; a single-page landing derives in-page anchors from
// each home section that carries an `eyebrow`.
export function anchorNav(): Array<{ href: string; label: string }> {
  const pageNav = content.pages
    .filter((p) => typeof p.nav === 'string')
    .map((p) => ({ href: p.slug, label: p.nav as string }));
  if (pageNav.length) return pageNav;
  const home = content.pages.find((p) => p.slug === '/') ?? content.pages[0]!;
  const seen = new Set<string>();
  const out: Array<{ href: string; label: string }> = [];
  for (const s of home.sections) {
    const eb = (s as { eyebrow?: string }).eyebrow;
    if (!eb) continue;
    const id = slugify(eb);
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({ href: '#' + id, label: eb });
  }
  return out.slice(0, 5);
}

// A section's anchor id (for in-page nav) — the slug of its eyebrow, if any.
export function sectionId(s: { eyebrow?: string }): string | undefined {
  return s.eyebrow ? slugify(s.eyebrow) : undefined;
}

export function headerCta(): { label: string; href: string } {
  return content.headerCta ?? { label: 'Contact', href: '#contact' };
}
