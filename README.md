# @neroxdev/remark-entity-chips

Transform entity mentions into rich, visual chips in Markdown. Works with Astro, Next.js, Docusaurus, and any remark-based pipeline.

---

## Examples

### Entity Mentions (`@[entity]`)

Entities in the built-in database are automatically resolved with their name, favicon, and URL.

<table>
<tr><th>Markdown</th><th>Result</th></tr>
<tr>
<td><code>@[stripe]</code></td>
<td><a href="https://stripe.com"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://stripe.com&size=48" alt="Stripe" width="16" height="16" /> Stripe</a></td>
</tr>
<tr>
<td><code>@[github]</code></td>
<td><a href="https://github.com"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://github.com&size=48" alt="GitHub" width="16" height="16" /> GitHub</a></td>
</tr>
<tr>
<td><code>@[openai]</code></td>
<td><a href="https://openai.com"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://openai.com&size=48" alt="OpenAI" width="16" height="16" /> OpenAI</a></td>
</tr>
<tr>
<td><code>@[react]</code></td>
<td><a href="https://react.dev"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://react.dev&size=48" alt="React" width="16" height="16" /> React</a></td>
</tr>
<tr>
<td><code>@[tailwindcss]</code></td>
<td><a href="https://tailwindcss.com"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://tailwindcss.com&size=48" alt="Tailwind CSS" width="16" height="16" /> Tailwind CSS</a></td>
</tr>
</table>

### Entity Mentions with Custom URL (`@[entity](url)`)

Use the entity's favicon and display name but link to a custom URL.

<table>
<tr><th>Markdown</th><th>Result</th></tr>
<tr>
<td><code>@[stripe](https://stripe.com/pricing)</code></td>
<td><a href="https://stripe.com/pricing"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://stripe.com&size=48" alt="Stripe" width="16" height="16" /> Stripe</a></td>
</tr>
</table>

### Custom Chips with Domain Favicon (`@[text](url)`)

If the text doesn't match an entity but the URL domain is in the database, the domain's favicon is used.

<table>
<tr><th>Markdown</th><th>Result</th></tr>
<tr>
<td><code>@[Nerox_dev](https://x.com/nerox_dev)</code></td>
<td><a href="https://x.com/nerox_dev"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://x.com&size=48" alt="X" width="16" height="16" /> Nerox_dev</a></td>
</tr>
<tr>
<td><code>@[John Doe](https://linkedin.com/in/johndoe)</code></td>
<td><a href="https://linkedin.com/in/johndoe"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://linkedin.com&size=48" alt="LinkedIn" width="16" height="16" /> John Doe</a></td>
</tr>
<tr>
<td><code>@[My Portfolio](https://example.com)</code></td>
<td><a href="https://example.com">My Portfolio</a></td>
</tr>
</table>

### Auto-Detected Bare URLs (enabled by default)

Bare platform URLs in text are automatically transformed into chips.

<table>
<tr><th>Markdown</th><th>Result</th></tr>
<tr>
<td><code>https://youtube.com/watch?v=dQw4w9WgXcQ</code></td>
<td><a href="https://youtube.com/watch?v=dQw4w9WgXcQ"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://youtube.com&size=48" alt="YouTube" width="16" height="16" /> youtube.com/watch?v=dQw4w9WgXcQ</a></td>
</tr>
<tr>
<td><code>https://github.com/facebook/react</code></td>
<td><a href="https://github.com/facebook/react"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://github.com&size=48" alt="GitHub" width="16" height="16" /> github.com/facebook/react</a></td>
</tr>
<tr>
<td><code>https://x.com/nerox_dev</code></td>
<td><a href="https://x.com/nerox_dev"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://x.com&size=48" alt="X" width="16" height="16" /> x.com/nerox_dev</a></td>
</tr>
</table>

### Markdown Links (opt-in)

Standard markdown links `[text](url)` can optionally be transformed into chips. **Disabled by default** to avoid breaking existing content.

<table>
<tr><th>Markdown</th><th>Result (when enabled)</th></tr>
<tr>
<td><code>[React docs](https://react.dev)</code></td>
<td><a href="https://react.dev"><img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://react.dev&size=48" alt="React" width="16" height="16" /> React docs</a></td>
</tr>
<tr>
<td><code>[My site](https://example.com)</code></td>
<td><a href="https://example.com">My site</a></td>
</tr>
</table>

---

## Installation

```bash
npm install @neroxdev/remark-entity-chips
```

## Quick Start

### Astro

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import entityChips from "@neroxdev/remark-entity-chips";

export default defineConfig({
  markdown: {
    remarkPlugins: [entityChips],
  },
});
```

### Next.js

```js
// next.config.mjs
import createMDX from "@next/mdx";
import entityChips from "@neroxdev/remark-entity-chips";

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
const entityChips = require("@neroxdev/remark-entity-chips").default;

module.exports = {
  presets: [
    [
      "classic",
      {
        docs: { remarkPlugins: [entityChips] },
        blog: { remarkPlugins: [entityChips] },
      },
    ],
  ],
};
```

## Configuration

```js
import entityChips from "@neroxdev/remark-entity-chips";

[
  entityChips,
  {
    // Transform bare URLs into chips (default: true)
    autoDetectUrls: true,

    // Transform markdown links [text](url) into chips (default: false)
    transformMarkdownLinks: false,

    // Custom CSS class names
    classNames: {
      chip: "entity-chip", // default
      favicon: "entity-favicon", // default
      name: "entity-name", // default
    },
  },
];
```

| Option                   | Type      | Default            | Description                              |
| ------------------------ | --------- | ------------------ | ---------------------------------------- |
| `autoDetectUrls`         | `boolean` | `true`             | Transform bare platform URLs into chips  |
| `transformMarkdownLinks` | `boolean` | `false`            | Transform `[text](url)` links into chips |
| `classNames.chip`        | `string`  | `"entity-chip"`    | CSS class for the chip wrapper           |
| `classNames.favicon`     | `string`  | `"entity-favicon"` | CSS class for the favicon image          |
| `classNames.name`        | `string`  | `"entity-name"`    | CSS class for the label text             |

## Supported Entities

The built-in database includes 200+ entities across categories:

| Category       | Examples                                                  |
| -------------- | --------------------------------------------------------- |
| **Frameworks** | React, Vue, Angular, Svelte, Astro, Next.js, Tailwind CSS |
| **Dev Tools**  | GitHub, GitLab, VS Code, Docker, Vite, ESLint             |
| **AI**         | OpenAI, Anthropic, Claude, Hugging Face                   |
| **Fintech**    | Stripe, PayPal, Wise, Square                              |
| **Social**     | YouTube, X, LinkedIn, Discord, Reddit                     |
| **Cloud**      | AWS, Google Cloud, Azure, Vercel, Netlify, Cloudflare     |
| **Databases**  | PostgreSQL, MongoDB, Redis, Supabase, Firebase, Prisma    |
| **SaaS**       | Notion, Slack, Figma, Linear, Jira                        |

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

## License

MIT
