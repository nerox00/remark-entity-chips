import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import entityChips from '../src/index.js';
import { _resetResolvedEntities } from '../src/utils/entity-lookup.js';
import { _resetDomainToSlugMap } from '../src/plugin/renderer.js';

const CUSTOM_ENTITIES_PATH = join(process.cwd(), 'entity-chips.json');

function processMarkdown(md: string, options = {}) {
  return unified()
    .use(remarkParse)
    .use(entityChips, options)
    .use(remarkHtml, { sanitize: false })
    .processSync(md)
    .toString();
}

function resetCaches() {
  _resetResolvedEntities();
  _resetDomainToSlugMap();
}

function writeCustomEntities(entities: Record<string, unknown>) {
  writeFileSync(CUSTOM_ENTITIES_PATH, JSON.stringify(entities));
}

function removeCustomEntities() {
  if (existsSync(CUSTOM_ENTITIES_PATH)) {
    unlinkSync(CUSTOM_ENTITIES_PATH);
  }
}

describe('EntityChips Plugin', () => {
  describe('@[entity] syntax', () => {
    it('transforms @[entity] into chip', () => {
      const result = processMarkdown('Check out @[stripe]');
      expect(result).toContain('class="entity-chip"');
      expect(result).toContain('Stripe');
      expect(result).toContain('href="https://stripe.com"');
      expect(result).toContain('t2.gstatic.com/faviconV2');
    });

    it('handles custom URLs', () => {
      const result = processMarkdown('@[stripe](https://stripe.com/pricing)');
      expect(result).toContain('href="https://stripe.com/pricing"');
      expect(result).toContain('Stripe');
    });

    it('handles generic links (not in database)', () => {
      const result = processMarkdown('@[My Site](https://example.com)');
      expect(result).toContain('href="https://example.com"');
      expect(result).toContain('My Site');
      expect(result).toContain('data-type="link"');
      expect(result).toContain('t2.gstatic.com/faviconV2');
    });

    it('falls back gracefully for unknown entities', () => {
      const result = processMarkdown('@[unknown-entity-xyz]');
      expect(result).toContain('class="entity-chip"');
      expect(result).toContain('data-type="generic"');
      expect(result).toContain('unknown-entity-xyz');
      expect(result).not.toContain('<img');
      expect(result).not.toContain('<a');
    });

    it('handles multiple entities in one line', () => {
      const result = processMarkdown('Use @[stripe] and @[paypal]');
      expect(result).toContain('Stripe');
      expect(result).toContain('PayPal');
    });

    it('is case-insensitive for entity lookup', () => {
      const result = processMarkdown('@[Stripe]');
      expect(result).toContain('Stripe');
      expect(result).toContain('entity-chip');
    });
  });

  describe('URL auto-detection', () => {
    it('detects YouTube URLs', () => {
      const result = processMarkdown('Watch https://youtube.com/watch?v=abc123');
      expect(result).toContain('t2.gstatic.com/faviconV2');
      expect(result).toContain('data-type="platform"');
    });

    it('detects GitHub URLs', () => {
      const result = processMarkdown('See https://github.com/facebook/react');
      expect(result).toContain('t2.gstatic.com/faviconV2');
    });

    it('detects Twitter/X URLs', () => {
      const result = processMarkdown('Follow https://twitter.com/elonmusk');
      expect(result).toContain('t2.gstatic.com/faviconV2');
    });

    it('detects LinkedIn URLs', () => {
      const result = processMarkdown('Connect https://linkedin.com/in/johndoe');
      expect(result).toContain('t2.gstatic.com/faviconV2');
    });
  });

  describe('options', () => {
    it('uses default image path', () => {
      const result = processMarkdown('@[stripe]');
      expect(result).toContain('t2.gstatic.com/faviconV2');
      expect(result).toContain('url=http://stripe.com');
    });

    it('uses custom class names', () => {
      const result = processMarkdown('@[stripe]', {
        classNames: { chip: 'my-chip', favicon: 'my-icon', name: 'my-name' },
      });
      expect(result).toContain('class="my-chip"');
      expect(result).toContain('class="my-icon"');
      expect(result).toContain('class="my-name"');
    });
  });

  describe('rendering', () => {
    it('renders data-entity attribute', () => {
      const result = processMarkdown('@[stripe]');
      expect(result).toContain('data-entity="stripe"');
    });

    it('renders data-type attribute', () => {
      const result = processMarkdown('@[stripe]');
      expect(result).toContain('data-type="company"');
    });

    it('renders img with correct dimensions', () => {
      const result = processMarkdown('@[stripe]');
      expect(result).toContain('width="16"');
      expect(result).toContain('height="16"');
    });

    it('preserves surrounding text', () => {
      const result = processMarkdown('Before @[stripe] after');
      expect(result).toContain('Before ');
      expect(result).toContain(' after');
    });
  });

  describe('entity-chips.json (custom entities)', () => {
    beforeEach(() => {
      resetCaches();
      removeCustomEntities();
    });

    afterAll(() => {
      removeCustomEntities();
      resetCaches();
    });

    it('loads custom entities from entity-chips.json', () => {
      writeCustomEntities({
        'acme-corp': {
          name: 'Acme Corp',
          domain: 'acme.com',
          url: 'https://acme.com',
          category: 'saas',
          type: 'company',
        },
      });
      resetCaches();

      const result = processMarkdown('@[acme-corp]');
      expect(result).toContain('Acme Corp');
      expect(result).toContain('href="https://acme.com"');
      expect(result).toContain('data-entity="acme-corp"');
    });

    it('custom entities override built-in ones', () => {
      writeCustomEntities({
        stripe: {
          name: 'Stripe Custom',
          domain: 'stripe.com',
          url: 'https://stripe.com/custom',
          category: 'fintech',
          type: 'company',
        },
      });
      resetCaches();

      const result = processMarkdown('@[stripe]');
      expect(result).toContain('Stripe Custom');
      expect(result).toContain('href="https://stripe.com/custom"');
    });

    it('works normally when entity-chips.json does not exist', () => {
      const result = processMarkdown('@[stripe]');
      expect(result).toContain('Stripe');
      expect(result).toContain('href="https://stripe.com"');
    });
  });

  describe('custom icon field', () => {
    beforeEach(() => {
      resetCaches();
      removeCustomEntities();
    });

    afterAll(() => {
      removeCustomEntities();
      resetCaches();
    });

    it('uses entity.icon when provided (local path)', () => {
      writeCustomEntities({
        'my-app': {
          name: 'My App',
          domain: 'myapp.com',
          url: 'https://myapp.com',
          category: 'saas',
          type: 'company',
          icon: '/entities/my-app.webp',
        },
      });
      resetCaches();

      const result = processMarkdown('@[my-app]');
      expect(result).toContain('src="/entities/my-app.webp"');
      expect(result).not.toContain('t2.gstatic.com');
    });

    it('uses entity.icon when provided (CDN URL)', () => {
      writeCustomEntities({
        'my-app': {
          name: 'My App',
          domain: 'myapp.com',
          url: 'https://myapp.com',
          category: 'saas',
          type: 'company',
          icon: 'https://cdn.example.com/icons/my-app.png',
        },
      });
      resetCaches();

      const result = processMarkdown('@[my-app]');
      expect(result).toContain('src="https://cdn.example.com/icons/my-app.png"');
      expect(result).not.toContain('t2.gstatic.com');
    });
  });

  describe('iconResolver option', () => {
    beforeEach(() => {
      resetCaches();
      removeCustomEntities();
    });

    afterAll(() => {
      removeCustomEntities();
      resetCaches();
    });

    it('uses iconResolver when provided', () => {
      const result = processMarkdown('@[stripe]', {
        iconResolver: (slug: string) => `/custom-icons/${slug}.svg`,
      });
      expect(result).toContain('src="/custom-icons/stripe.svg"');
      expect(result).not.toContain('t2.gstatic.com');
    });

    it('falls back to Google Favicon when iconResolver returns null', () => {
      const result = processMarkdown('@[stripe]', {
        iconResolver: () => null,
      });
      expect(result).toContain('t2.gstatic.com/faviconV2');
    });

    it('iconResolver takes priority over entity.icon', () => {
      writeCustomEntities({
        'my-app': {
          name: 'My App',
          domain: 'myapp.com',
          url: 'https://myapp.com',
          category: 'saas',
          type: 'company',
          icon: '/entities/my-app.webp',
        },
      });
      resetCaches();

      const result = processMarkdown('@[my-app]', {
        iconResolver: (slug: string) => `https://cdn.example.com/${slug}.png`,
      });
      expect(result).toContain('src="https://cdn.example.com/my-app.png"');
      expect(result).not.toContain('/entities/my-app.webp');
    });
  });
});
