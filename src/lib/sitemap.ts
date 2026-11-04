import { routes } from '../data/routes.ts';
import { siteConfig } from '../data/site.ts';

export function isIndexableURL(value: string): boolean {
  const url = new URL(value);
  return (
    url.origin === siteConfig.origin &&
    url.search === '' &&
    url.hash === '' &&
    routes.some((route) => route.indexable && route.path === url.pathname)
  );
}

export const hasIndexablePages = routes.some((route) => route.indexable);
