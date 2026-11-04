import type { SitePath } from '../types/site.ts';

interface PublicPageMetadata {
  title: string;
  headline: string;
  eyebrow: string;
  description: string;
  intro: string;
}

export const publicPages = {
  '/services/': {
    title: 'Growth Marketing & Sales Development Services',
    headline: 'One growth system. Capabilities that connect.',
    eyebrow: 'SOLUTIONS',
    description:
      'Explore Markevance’s connected growth marketing and sales-development capabilities, from demand generation and lead capture to qualification and measurement.',
    intro:
      'Start with the business bottleneck, then connect the capabilities needed to address it. Our work spans marketing, lead generation, sales development, conversion and measurement.',
  },
  '/industries/': {
    title: 'Technology & Education Growth Marketing',
    headline: 'Designed around how your buyers make decisions.',
    eyebrow: 'PRIMARY INDUSTRIES',
    description:
      'Growth marketing and sales development for technology, software and education businesses in Nepal, with distinct buying and enquiry-to-admission journeys.',
    intro:
      'Technology and software businesses need relevant commercial conversations. Education providers need informed student enquiries and consistent counselling follow-up. The growth system must reflect those differences.',
  },
  '/how-we-work/': {
    title: 'How We Work: The Markevance Growth System',
    headline: 'Give every stage a purpose. Give every handoff an owner.',
    eyebrow: 'THE OPERATING MODEL',
    description:
      'How Markevance connects discovery, strategy, demand generation, lead capture, qualification, sales development and measurement in one growth system.',
    intro:
      'Generate Demand. Capture Interest. Qualify. Develop. Measure. Each stage has a defined responsibility, a useful next action and an outcome to review.',
  },
  '/about/': {
    title: 'About Markevance: Growth Marketing + Sales Development',
    headline: 'Built around the connection between marketing and sales.',
    eyebrow: 'ABOUT MARKEVANCE',
    description:
      'Markevance is a Nepal-first growth marketing and sales-development business focused on connected customer acquisition for technology, software and education.',
    intro:
      'Markevance connects growth marketing and sales development for businesses with a working offer, existing customers and room to grow. Our focus is qualified pipeline and commercial discipline.',
  },
  '/contact/': {
    title: 'Contact Markevance',
    headline: 'Start with your business and the growth problem.',
    eyebrow: 'CONTACT',
    description:
      'Email or WhatsApp Markevance, or read what to prepare for a growth marketing and sales-development consultation.',
    intro:
      'A useful first conversation starts with what you sell, who buys it and where customer acquisition gets stuck.',
  },
  '/insights/': {
    title: 'Markevance Insights: Growth, Search & Sales Development',
    headline: 'Useful questions. Clearer growth decisions.',
    eyebrow: 'MARKEVANCE INSIGHTS',
    description:
      'The Markevance editorial focus: B2B growth, technology marketing, education, search visibility and sales development. Verified articles will appear as they are ready.',
    intro:
      'Practical analysis for leaders connecting demand generation, customer acquisition and sales follow-through. This library will prioritise useful explanations and evidence over publication volume.',
  },
  '/case-studies/': {
    title: 'Markevance Case Studies & Evidence Standards',
    headline: 'Evidence should explain what actually changed.',
    eyebrow: 'CASE STUDIES',
    description:
      'Markevance’s standards for publishing verified case studies: situation, strategy, execution, timeframe, measurable evidence, permissions and limitations.',
    intro:
      'A useful case study connects the original business problem to the work performed and the result that can be supported. Client permission and reliable evidence come before publication.',
  },
  '/thank-you/': {
    title: 'Consultation Request Status',
    headline: 'No request is confirmed here.',
    eyebrow: 'REQUEST STATUS',
    description:
      'Visiting this page does not confirm a consultation request, subscription or booking. Complete verification with Formspree to submit your request.',
    intro:
      'Opening this page does not submit an enquiry or book a consultation. The request form continues to Formspree for verification and confirmation.',
  },
} satisfies Partial<Record<SitePath, PublicPageMetadata>>;

export function getPublicPage(path: SitePath): PublicPageMetadata | undefined {
  return Object.entries(publicPages).find(([key]) => key === path)?.[1];
}
