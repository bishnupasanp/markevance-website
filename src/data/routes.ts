import type { RouteDefinition, SitePath } from '../types/site.ts';

// V1 publication eligibility. Contact, unavailable conversion, empty libraries
// and owner-review legal routes stay noindex; secondary expansion is deferred.
export const routes: readonly RouteDefinition[] = [
  {
    path: '/',
    title: 'Markevance',
    intent: 'Growth marketing agency Nepal',
    indexable: true,
  },
  {
    path: '/services/',
    title: 'Solutions',
    intent:
      'Connected growth capabilities and the three core engagement models',
    indexable: true,
  },
  {
    path: '/services/b2b-lead-generation/',
    title: 'B2B Lead Generation',
    intent: 'B2B lead generation Nepal',
    parent: '/services/',
    indexable: true,
  },
  {
    path: '/services/paid-acquisition/',
    title: 'Paid Acquisition',
    intent: 'Google Ads and performance marketing Nepal',
    parent: '/services/',
    indexable: true,
  },
  {
    path: '/services/seo-aeo-geo/',
    title: 'SEO + AEO + GEO',
    intent: 'Connected traditional and AI search visibility',
    parent: '/services/',
    indexable: true,
  },
  {
    path: '/services/fractional-sdr/',
    title: 'Fractional SDR',
    intent:
      'Outsourced prospecting, qualification, follow-up and meeting booking',
    parent: '/services/',
    indexable: true,
  },
  {
    path: '/services/crm-automation/',
    title: 'CRM & Automation',
    intent: 'CRM setup and follow-up discipline',
    parent: '/services/',
    indexable: true,
  },
  {
    path: '/industries/',
    title: 'Industries',
    intent: 'Priority industry overview',
    indexable: true,
  },
  {
    path: '/industries/technology-software/',
    title: 'Technology & Software',
    intent: 'Technology and software marketing Nepal',
    parent: '/industries/',
    indexable: true,
  },
  {
    path: '/industries/education/',
    title: 'Education',
    intent: 'Education marketing and student enquiry journeys',
    parent: '/industries/',
    indexable: true,
  },
  {
    path: '/how-we-work/',
    title: 'How We Work',
    intent: 'Diagnosis, execution and measurement methodology',
    indexable: true,
  },
  {
    path: '/about/',
    title: 'About Markevance',
    intent: 'Company identity and approved expertise',
    indexable: true,
  },
  {
    path: '/book-consultation/',
    title: 'Book a Growth Consultation',
    intent: 'Consultation qualification and secure lead handoff',
    indexable: false,
  },
  {
    path: '/contact/',
    title: 'Contact',
    intent: 'Verified contact options',
    indexable: false,
  },
  {
    path: '/insights/',
    title: 'Insights',
    intent: 'Useful research and guides',
    indexable: false,
  },
  {
    path: '/case-studies/',
    title: 'Case Studies',
    intent: 'Verified and permissioned client work',
    indexable: false,
  },
  {
    path: '/privacy-policy/',
    title: 'Privacy Policy',
    intent: 'Actual collection, providers and data handling',
    indexable: false,
  },
  {
    path: '/terms/',
    title: 'Terms',
    intent: 'Owner-approved website terms',
    indexable: false,
  },
  {
    path: '/cookie-policy/',
    title: 'Cookie Policy',
    intent: 'Actual cookie and tracking practices where applicable',
    indexable: false,
  },
  {
    path: '/thank-you/',
    title: 'Submission Confirmation',
    intent: 'Accepted submission handoff only',
    indexable: false,
  },
];

export function getRoute(path: SitePath): RouteDefinition {
  const route = routes.find((entry) => entry.path === path);
  if (!route) throw new Error(`Unknown route: ${path}`);
  return route;
}
