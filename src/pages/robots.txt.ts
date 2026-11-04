import type { APIRoute } from 'astro';
import { siteConfig } from '../data/site.ts';
import { hasIndexablePages } from '../lib/sitemap.ts';

// Allow crawling so crawlers can read noindex tags. Robots rules are not privacy.
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\n${hasIndexablePages ? `\nSitemap: ${siteConfig.origin}/sitemap-index.xml\n` : ''}`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
