import type { EntityChipsOptions } from '../types.js';
import type { ParsedMention } from './parser.js';
import type { DetectedUrl } from './url-detector.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getImagePath(slug: string, options: EntityChipsOptions): string {
  if (options.cdnUrl) {
    return `${options.cdnUrl}/${slug}.webp`;
  }
  return `/entities/${slug}.webp`;
}

export function renderEntityChip(mention: ParsedMention, options: EntityChipsOptions): string {
  const cls = options.classNames ?? {};
  const chipClass = cls.chip ?? 'entity-chip';
  const faviconClass = cls.favicon ?? 'entity-favicon';
  const nameClass = cls.name ?? 'entity-name';

  if (!mention.url) {
    // No URL and no entity found — render as plain text
    return escapeHtml(mention.fullMatch);
  }

  const href = escapeHtml(mention.url);
  const name = escapeHtml(mention.displayName);

  if (mention.entity) {
    const imgSrc = getImagePath(mention.slug, options);
    const dataType = mention.entity.type;
    return `<a href="${href}" class="${chipClass}" data-entity="${escapeHtml(mention.slug)}" data-type="${dataType}"><img src="${imgSrc}" alt="${name}" width="16" height="16" class="${faviconClass}" /><span class="${nameClass}">${name}</span></a>`;
  }

  // Generic link chip (not in entity database but has a URL)
  return `<a href="${href}" class="${chipClass}" data-type="link"><span class="${nameClass}">${name}</span></a>`;
}

export function renderUrlChip(detected: DetectedUrl, options: EntityChipsOptions): string {
  const cls = options.classNames ?? {};
  const chipClass = cls.chip ?? 'entity-chip';
  const faviconClass = cls.favicon ?? 'entity-favicon';
  const nameClass = cls.name ?? 'entity-name';

  const imgSrc = getImagePath(detected.slug, options);
  const href = escapeHtml(detected.url);
  const displayUrl = escapeHtml(detected.url.replace(/^https?:\/\//, ''));

  return `<a href="${href}" class="${chipClass}" data-entity="${escapeHtml(detected.platform)}" data-type="platform"><img src="${imgSrc}" alt="${escapeHtml(detected.platform)}" width="16" height="16" class="${faviconClass}" /><span class="${nameClass}">${displayUrl}</span></a>`;
}
