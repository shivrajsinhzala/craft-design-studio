import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://craftdesignstudio.in',
  trailingSlash: 'always',
  integrations: [react()],
  redirects: {
    // Target of the printed Instagram QR code — keep this path stable
    '/instagram': 'https://www.instagram.com/craft_design_studio1/',
  },
});
