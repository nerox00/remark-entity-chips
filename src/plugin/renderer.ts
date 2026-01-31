import type { EntityChipsOptions } from '../types.js';
import type { ParsedMention } from './parser.js';
import type { DetectedUrl } from './url-detector.js';
import entities from '../data/entities.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Build a reverse lookup: domain -> entity slug (lazy, built once)
let domainToSlug: Record<string, string> | null = null;

function getDomainToSlugMap(): Record<string, string> {
  if (!domainToSlug) {
    domainToSlug = {};
    for (const [slug, entity] of Object.entries(entities)) {
      if (entity.domain) {
        domainToSlug[entity.domain] = slug;
      }
    }
  }
  return domainToSlug;
}

function getSlugFromUrl(url: string): string | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    const map = getDomainToSlugMap();
    // Exact match first
    if (map[hostname]) return map[hostname];
    // Try without subdomain (e.g. "in.linkedin.com" -> "linkedin.com")
    const parts = hostname.split('.');
    if (parts.length > 2) {
      const baseDomain = parts.slice(-2).join('.');
      if (map[baseDomain]) return map[baseDomain];
    }
    return null;
  } catch {
    return null;
  }
}

const CDN_BASE = 'https://cdn.jsdelivr.net/npm/@neroxdev/remark-entity-chips/public/entities';

function getImagePath(slug: string): string {
  return `${CDN_BASE}/${slug}.webp`;
}

export function renderEntityChip(mention: ParsedMention, options: EntityChipsOptions): string {
  const cls = options.classNames ?? {};
  const chipClass = cls.chip ?? 'entity-chip';
  const faviconClass = cls.favicon ?? 'entity-favicon';
  const nameClass = cls.name ?? 'entity-name';

  if (!mention.url) {
    const name = escapeHtml(mention.displayName);
    return `<span class="${chipClass}" data-entity="${escapeHtml(mention.slug)}" data-type="generic"><span class="${nameClass}">${name}</span></span>`;
  }

  const href = escapeHtml(mention.url);
  const name = escapeHtml(mention.displayName);

  // Entity found in db: use platform favicon from entity URL or own slug
  if (mention.entity) {
    const dataType = mention.entity.type;
    const imgSlug = getSlugFromUrl(mention.entity.url) ?? mention.slug;
    const imgSrc = getImagePath(imgSlug);
    return `<a href="${href}" class="${chipClass}" data-entity="${escapeHtml(mention.slug)}" data-type="${dataType}"><img src="${imgSrc}" alt="${name}" width="16" height="16" class="${faviconClass}" /><span class="${nameClass}">${name}</span></a>`;
  }

  // Entity NOT in db but has a URL: try to find favicon from the URL domain
  const domainSlug = getSlugFromUrl(mention.url);
  if (domainSlug) {
    const imgSrc = getImagePath(domainSlug);
    return `<a href="${href}" class="${chipClass}" data-entity="${escapeHtml(domainSlug)}" data-type="link"><img src="${imgSrc}" alt="${name}" width="16" height="16" class="${faviconClass}" /><span class="${nameClass}">${name}</span></a>`;
  }

  // No favicon available
  return `<a href="${href}" class="${chipClass}" data-type="link"><span class="${nameClass}">${name}</span></a>`;
}

export function renderLinkChip(text: string, url: string, options: EntityChipsOptions): string {
  const cls = options.classNames ?? {};
  const chipClass = cls.chip ?? 'entity-chip';
  const faviconClass = cls.favicon ?? 'entity-favicon';
  const nameClass = cls.name ?? 'entity-name';

  const href = escapeHtml(url);
  const name = escapeHtml(text);
  const domainSlug = getSlugFromUrl(url);

  if (domainSlug) {
    const imgSrc = getImagePath(domainSlug);
    return `<a href="${href}" class="${chipClass}" data-entity="${escapeHtml(domainSlug)}" data-type="link"><img src="${imgSrc}" alt="${name}" width="16" height="16" class="${faviconClass}" /><span class="${nameClass}">${name}</span></a>`;
  }

  return `<a href="${href}" class="${chipClass}" data-type="link"><span class="${nameClass}">${name}</span></a>`;
}

export function renderUrlChip(detected: DetectedUrl, options: EntityChipsOptions): string {
  const cls = options.classNames ?? {};
  const chipClass = cls.chip ?? 'entity-chip';
  const faviconClass = cls.favicon ?? 'entity-favicon';
  const nameClass = cls.name ?? 'entity-name';

  const imgSrc = getImagePath(detected.slug);
  const href = escapeHtml(detected.url);
  const displayUrl = escapeHtml(detected.url.replace(/^https?:\/\//, ''));

  return `<a href="${href}" class="${chipClass}" data-entity="${escapeHtml(detected.platform)}" data-type="platform"><img src="${imgSrc}" alt="${escapeHtml(detected.platform)}" width="16" height="16" class="${faviconClass}" /><span class="${nameClass}">${displayUrl}</span></a>`;
}
