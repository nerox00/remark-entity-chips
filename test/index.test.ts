import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import entityChips from '../src/index.js';

function processMarkdown(md: string, options = {}) {
  return unified()
    .use(remarkParse)
    .use(entityChips, options)
    .use(remarkHtml, { sanitize: false })
    .processSync(md)
    .toString();
}

describe('EntityChips Plugin', () => {
  describe('@[entity] syntax', () => {
    it('transforms @[entity] into chip', () => {
      const result = processMarkdown('Check out @[stripe]');
      expect(result).toContain('class="entity-chip"');
      expect(result).toContain('Stripe');
      expect(result).toContain('href="https://stripe.com"');
      expect(result).toContain('stripe.webp');
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
      expect(result).not.toContain('<img');
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
      expect(result).toContain('youtube.webp');
      expect(result).toContain('data-type="platform"');
    });

    it('detects GitHub URLs', () => {
      const result = processMarkdown('See https://github.com/facebook/react');
      expect(result).toContain('github.webp');
    });

    it('detects Twitter/X URLs', () => {
      const result = processMarkdown('Follow https://twitter.com/elonmusk');
      expect(result).toContain('x.webp');
    });

    it('detects LinkedIn URLs', () => {
      const result = processMarkdown('Connect https://linkedin.com/in/johndoe');
      expect(result).toContain('linkedin.webp');
    });
  });

  describe('options', () => {
    it('uses default image path', () => {
      const result = processMarkdown('@[stripe]');
      expect(result).toContain('cdn.jsdelivr.net/npm/@neroxdev/remark-entity-chips/public/entities/stripe.webp');
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
});
