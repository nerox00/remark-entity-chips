import { defineConfig } from 'astro/config';
import entityChips from '@entitychips/remark';

import tailwind from '@astrojs/tailwind';

export default defineConfig({
  markdown: {
    remarkPlugins: [entityChips],
  },

  integrations: [tailwind()],
});