// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { siteConfig } from './src/data/site.ts';
import { isIndexableURL } from './src/lib/sitemap.ts';

export default defineConfig({
  site: siteConfig.origin,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "base-uri 'none'",
        "object-src 'none'",
        "connect-src 'none'",
        'form-action https://formspree.io',
        "frame-src 'none'",
        "font-src 'self'",
        "img-src 'self'",
        "media-src 'none'",
        "worker-src 'none'",
      ],
      scriptDirective: {
        // Astro retains its default 'self' and generated hashes for elements.
        resources: [{ resource: "'none'", kind: 'attribute' }],
      },
      styleDirective: {
        // Existing diagrams use layout attributes; executable inline JS stays blocked.
        resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  integrations: [sitemap({ filter: isIndexableURL })],
  vite: { plugins: [tailwindcss()] },
});
