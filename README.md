# @entitychips/remark

Transform entity mentions into rich, visual chips in Markdown. Works with Astro, Next.js, Docusaurus, and any remark-based pipeline.

**Before:**
```
Check out @[stripe] for payments and @[github] for code hosting.
```

**After:**
<p>Check out <a href="https://stripe.com" class="entity-chip" data-entity="stripe" data-type="company"><img src="/entities/stripe.webp" alt="Stripe" width="16" height="16" class="entity-favicon" /><span class="entity-name">Stripe</span></a> for payments and <a href="https://github.com" class="entity-chip" data-entity="github" data-type="platform"><img src="/entities/github.webp" alt="GitHub" width="16" height="16" class="entity-favicon" /><span class="entity-name">GitHub</span></a> for code hosting.</p>

---

## Installation

```bash
npm install @entitychips/remark
```

## Quick Start

### Astro

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import entityChips from '@entitychips/remark';

export default defineConfig({
  markdown: {
    remarkPlugins: [entityChips],
  },
});
```

### Next.js

```js
// next.config.mjs
import createMDX from '@next/mdx';
import entityChips from '@entitychips/remark';

const withMDX = createMDX({
  options: {
    remarkPlugins: [entityChips],
  },
});

export default withMDX({});
```

### Docusaurus

```js
// docusaurus.config.js
const entityChips = require('@entitychips/remark').default;

module.exports = {
  presets: [
    ['classic', {
      docs: { remarkPlugins: [entityChips] },
      blog: { remarkPlugins: [entityChips] },
    }],
  ],
};
```

## Syntax

### Entity Mention

```markdown
@[stripe]
```

Looks up "stripe" in the entity database and renders a chip with its name, favicon, and URL.

### Custom URL

```markdown
@[stripe](https://stripe.com/pricing)
```

Uses the entity's display name and favicon but links to a custom URL.

### Generic Link

```markdown
@[My Portfolio](https://example.com)
```

If the text doesn't match an entity, renders a plain chip linking to the URL.

### Auto-Detected URLs

Platform URLs are automatically detected and rendered as chips:

```markdown
https://youtube.com/watch?v=dQw4w9WgXcQ
https://github.com/facebook/react
https://twitter.com/elonmusk
https://linkedin.com/in/johndoe
```

## Supported Entities

The built-in database includes 300+ entities across categories:

| Category | Examples |
|----------|----------|
| **Fintech** | Stripe, PayPal, Wise, Square |
| **AI** | OpenAI, Anthropic, Google DeepMind |
| **Social** | YouTube, Twitter, LinkedIn |
| **Dev Tools** | GitHub, GitLab, VS Code |

## Configuration

```js
import entityChips from '@entitychips/remark';

// With options
[entityChips, {
  // Use CDN for production images
  cdnUrl: 'https://cdn.jsdelivr.net/npm/@entitychips/remark@latest/public/entities',

  // Custom CSS class names
  classNames: {
    chip: 'my-chip',
    favicon: 'my-icon',
    name: 'my-label',
  },
}]
```

### Image Setup

Copy the `public/entities/` folder from this package into your project's public/static directory, or use the jsDelivr CDN option above.

## Styling

Add CSS to style the chips:

```css
.entity-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 16px;
  background: #f0f0f0;
  text-decoration: none;
  color: #333;
  font-size: 0.9em;
  border: 1px solid #ddd;
}

.entity-chip:hover {
  background: #e0e0e0;
}

.entity-favicon {
  border-radius: 2px;
}
```

## API

### Utility Functions

```typescript
import { getEntity, getAllEntities, getEntitiesByCategory, entities } from '@entitychips/remark';

const stripe = getEntity('stripe');
// { name: "Stripe", domain: "stripe.com", url: "https://stripe.com", ... }

const fintechEntities = getEntitiesByCategory('fintech');
```

## Contributing

To add new entities, edit `src/data/entities.ts`:

```typescript
"my-entity": {
  name: "My Entity",
  domain: "example.com",
  url: "https://example.com",
  category: "category",
  type: "company",
},
```

Add a 16x16 `.webp` favicon to `public/entities/my-entity.webp`.

## License

MIT
