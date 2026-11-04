import type { SitePath } from './site.ts';

export interface ProcessStep {
  title: string;
  copy: string;
}

export interface PageLink {
  label: string;
  href: SitePath;
}

export interface ServiceDefinition {
  path: SitePath;
  name: string;
  title: string;
  headline: string;
  description: string;
  intro: string;
  problem: { title: string; paragraphs: readonly string[] };
  audience: readonly string[];
  work: readonly ProcessStep[];
  process: readonly ProcessStep[];
  connection: string;
  outcomes: string;
  measures: readonly string[];
  boundary: string;
  related: readonly PageLink[];
}

export interface IndustryDefinition {
  path: SitePath;
  name: string;
  title: string;
  headline: string;
  description: string;
  intro: string;
  audience: readonly string[];
  problem: { title: string; paragraphs: readonly string[] };
  journey: readonly ProcessStep[];
  work: readonly ProcessStep[];
  agency: string;
  client: string;
  measures: readonly string[];
  related: readonly PageLink[];
}

export interface LegalDefinition {
  reviewPending: boolean;
  path: SitePath;
  title: string;
  description: string;
  intro: string;
  sections: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
  }[];
}
