import type { NavigationGroup, NavigationItem } from '../types/site.ts';

export const serviceNavigation: readonly NavigationItem[] = [
  { label: 'B2B Lead Generation', href: '/services/b2b-lead-generation/' },
  { label: 'Paid Acquisition', href: '/services/paid-acquisition/' },
  { label: 'SEO + AEO + GEO', href: '/services/seo-aeo-geo/' },
  { label: 'Fractional SDR', href: '/services/fractional-sdr/' },
  { label: 'CRM & Automation', href: '/services/crm-automation/' },
];

export const industryNavigation: readonly NavigationItem[] = [
  { label: 'Technology & Software', href: '/industries/technology-software/' },
  { label: 'Education', href: '/industries/education/' },
];

export const mainNavigation: readonly NavigationItem[] = [
  { label: 'Solutions', href: '/services/', children: serviceNavigation },
  { label: 'Industries', href: '/industries/', children: industryNavigation },
  { label: 'How We Work', href: '/how-we-work/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'About', href: '/about/' },
];

export const footerNavigation: readonly NavigationGroup[] = [
  { label: 'Solutions', items: serviceNavigation },
  { label: 'Industries', items: industryNavigation },
  {
    label: 'Company',
    items: [
      { label: 'About', href: '/about/' },
      { label: 'How We Work', href: '/how-we-work/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  { label: 'Resources', items: [{ label: 'Insights', href: '/insights/' }] },
  {
    label: 'Legal',
    items: [
      { label: 'Privacy Policy', href: '/privacy-policy/' },
      { label: 'Terms', href: '/terms/' },
      { label: 'Cookie Policy', href: '/cookie-policy/' },
    ],
  },
];
