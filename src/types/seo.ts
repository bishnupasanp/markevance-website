import type { SitePath } from './site.ts';

export interface PageMetadata {
  title: string;
  description: string;
  path: SitePath;
  noindex?: boolean;
  canonicalURL?: string;
  ogImage?: string;
  ogImageAlt?: string;
  type?: 'website' | 'article';
}

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
