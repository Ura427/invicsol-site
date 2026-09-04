import { en } from './en';
import { uk } from './uk';
import type { SiteContent } from './types';

export type { SiteContent } from './types';
export type * from './types';

const content: Record<'uk' | 'en', SiteContent> = { uk, en };

export function getContent(locale: string): SiteContent {
  return content[locale === 'en' ? 'en' : 'uk'];
}

/**
 * Placeholder rows (testimonials, team bios, financing terms) still render during
 * development so the site can be reviewed end-to-end — but every widget that
 * consumes them must badge them visibly (see `PlaceholderBadge`) so they are never
 * presented to a real visitor as genuine. This function is the audit surface: it
 * collects every `isPlaceholder: true` row across the content set so a launch
 * checklist can enumerate exactly what still needs real content.
 */
export function listPlaceholderContent(siteContent: SiteContent): readonly string[] {
  const flagged: string[] = [];
  for (const t of siteContent.testimonials) {
    if (t.isPlaceholder) flagged.push(`testimonial:${t.id}`);
  }
  for (const m of siteContent.team) {
    if (m.isPlaceholder) flagged.push(`team:${m.id}`);
  }
  for (const f of siteContent.financing) {
    if (f.isPlaceholder) flagged.push(`financing:${f.id}`);
  }
  return flagged;
}
