import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://craftdesignstudio.in',
  trailingSlash: 'always',
  integrations: [react()],
});
