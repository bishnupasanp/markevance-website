import type { SiteIdentity } from '../types/site.ts';

export const siteConfig = {
  name: 'Markevance',
  wordmark: 'MARKEVANCE',
  origin: 'https://markevance.com',
  language: 'en',
  locale: 'en_NP',
  title: 'Markevance | Growth Marketing & Sales Development Agency Nepal',
  description:
    'Markevance helps technology, software and education businesses generate demand, qualified leads and measurable sales pipeline through marketing and sales development.',
  tagline: 'Create demand. Build pipeline. Advance growth.',
  positioning: 'Growth Marketing + Sales Development',
} as const satisfies SiteIdentity;
