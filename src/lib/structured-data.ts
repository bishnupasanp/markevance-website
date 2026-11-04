import { siteConfig } from '../data/site.ts';
import { brandProfileImage } from '../data/logo.ts';
import { canonicalURL } from './seo.ts';
import type { JsonValue } from '../types/seo.ts';
import type { BreadcrumbItem } from '../types/site.ts';

export function serializeJsonLd(data: JsonValue): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function organizationSchema(): JsonValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.origin}/#organization`,
    name: siteConfig.name,
    url: `${siteConfig.origin}/`,
    description: siteConfig.positioning,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.origin}${brandProfileImage.src}`,
      width: brandProfileImage.width,
      height: brandProfileImage.height,
    },
  };
}

export function websiteSchema(): JsonValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.origin}/#website`,
    name: siteConfig.name,
    url: `${siteConfig.origin}/`,
    inLanguage: siteConfig.language,
    publisher: { '@id': `${siteConfig.origin}/#organization` },
  };
}

export function serviceSchema(
  name: string,
  description: string,
  path: string,
): JsonValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${canonicalURL(path)}#service`,
    name,
    serviceType: name,
    description,
    url: canonicalURL(path),
    provider: { '@id': `${siteConfig.origin}/#organization` },
    areaServed: { '@type': 'Country', name: 'Nepal' },
  };
}

export function breadcrumbSchema(
  items: readonly BreadcrumbItem[],
  currentPath: string,
): JsonValue {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: canonicalURL(item.href ?? currentPath),
    })),
  };
}
