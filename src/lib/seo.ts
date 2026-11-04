import { siteConfig } from '../data/site.ts';
import { brandProfileImage } from '../data/logo.ts';
import type { PageMetadata } from '../types/seo.ts';

export function absoluteHttpsURL(value: string): string {
  const url = new URL(value, siteConfig.origin);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Metadata URLs must use HTTPS without credentials.');
  }
  return url.href;
}

export function canonicalURL(path: string): string {
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    throw new Error('Canonical paths must be local absolute paths.');
  }
  const url = new URL(path, siteConfig.origin);
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.href;
}

export function resolveMetadata(metadata: PageMetadata) {
  return {
    title:
      metadata.title === siteConfig.title
        ? metadata.title
        : `${metadata.title} | ${siteConfig.name}`,
    description: metadata.description,
    canonical: metadata.canonicalURL
      ? absoluteHttpsURL(metadata.canonicalURL)
      : canonicalURL(metadata.path),
    noindex: metadata.noindex ?? true,
    type: metadata.type ?? 'website',
    image: absoluteHttpsURL(metadata.ogImage ?? brandProfileImage.src),
    imageAlt: metadata.ogImage ? metadata.ogImageAlt : brandProfileImage.alt,
    imageWidth: metadata.ogImage ? undefined : brandProfileImage.width,
    imageHeight: metadata.ogImage ? undefined : brandProfileImage.height,
    twitterCard: metadata.ogImage ? 'summary_large_image' : 'summary',
  };
}
