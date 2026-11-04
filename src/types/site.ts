export type SitePath = `/${string}`;

export interface SiteIdentity {
  name: string;
  wordmark: string;
  origin: `https://${string}`;
  language: string;
  locale: string;
  title: string;
  description: string;
  tagline: string;
  positioning: string;
}

export interface NavigationItem {
  label: string;
  href: SitePath;
  children?: readonly NavigationItem[];
}

export interface NavigationGroup {
  label: string;
  items: readonly NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: SitePath;
}

export interface RouteDefinition {
  path: SitePath;
  title: string;
  intent: string;
  parent?: SitePath;
  // Change only after the page's content and functionality are approved for launch.
  indexable: boolean;
}
