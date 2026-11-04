import type { IndustryDefinition } from '../types/public-pages.ts';

// Adapts the preserved sector draft's buyer-journey distinction without its
// regional-operations or guaranteed-deliverable implications.
export const industries: readonly IndustryDefinition[] = [
  {
    path: '/industries/technology-software/',
    name: 'Technology & Software',
    title: 'Technology & Software Marketing in Nepal',
    headline: 'Connect a strong product to the right buying conversation.',
    description:
      'Growth marketing and sales development for technology and software businesses in Nepal, connecting target accounts, qualified conversations and client-led sales.',
    intro:
      'For technology businesses with a working product, existing customers and capacity to grow. Markevance connects demand generation and sales development around the way B2B buyers evaluate a solution.',
    audience: [
      'SaaS, ERP, accounting, POS and inventory software.',
      'Cybersecurity, cloud, hosting and IT services.',
      'Software development and other B2B technology providers.',
    ],
    problem: {
      title: 'Your buyer needs context before a demo.',
      paragraphs: [
        'Complex products need a clear explanation of the problem they solve, who they serve and why a conversation is worth having. Referral dependence and broad campaigns can leave a sales team without a consistent source of relevant accounts.',
        'We connect problem-aware search, relevant content and targeted prospecting to qualification. The aim is to prepare a useful commercial conversation, not to book a demo with every contact.',
      ],
    },
    journey: [
      {
        title: 'Target Account',
        copy: 'A company that fits the agreed customer profile.',
      },
      {
        title: 'Qualified Conversation',
        copy: 'Relevant fit and an expressed problem or interest.',
      },
      {
        title: 'Meeting / Demo',
        copy: 'A client-led discussion of the solution and requirements.',
      },
      {
        title: 'Opportunity',
        copy: 'The client confirms a credible commercial next step.',
      },
    ],
    work: [
      {
        title: 'Clarify account and buyer fit',
        copy: 'Define the business types, decision makers, buying problems and disqualifiers. Turn product knowledge into a specific proposition.',
      },
      {
        title: 'Connect inbound and outbound',
        copy: 'Use relevant search pages, paid acquisition and prospect research as appropriate. Keep campaign promises consistent with the actual product.',
      },
      {
        title: 'Develop the conversation',
        copy: 'Qualify interest, document requirements, follow up and book a relevant meeting for the client’s team.',
      },
      {
        title: 'Review the handoff',
        copy: 'Use meeting feedback and opportunity outcomes to improve targeting, messages and qualification.',
      },
    ],
    agency:
      'Markevance can handle targeting, prospect research, outreach, qualification, follow-up and meeting booking within the agreed engagement.',
    client:
      'The client handles technical demos, detailed pricing, negotiation, commitments and final closing unless separately agreed. A booked meeting is not automatically a sales opportunity or won customer.',
    measures: [
      'Qualified conversations',
      'Meetings attended',
      'Sales-accepted handoffs',
      'Opportunities confirmed by the client',
      'Lead-source quality',
      'Reasons prospects do not progress',
    ],
    related: [
      { label: 'B2B Lead Generation', href: '/services/b2b-lead-generation/' },
      { label: 'Fractional SDR', href: '/services/fractional-sdr/' },
      { label: 'SEO + AEO + GEO', href: '/services/seo-aeo-geo/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
  {
    path: '/industries/education/',
    name: 'Education',
    title: 'Education Marketing & Student Enquiries in Nepal',
    headline: 'Build a clearer path from enquiry to admission.',
    description:
      'Education marketing for colleges, consultancies, training and EdTech in Nepal, connecting accurate programme information, qualified enquiries and counselling follow-up.',
    intro:
      'Bring acquisition and admissions follow-up into one measurable journey. Markevance helps education providers explain their programmes, reach relevant prospective students and manage the next conversation.',
    audience: [
      'Colleges and education consultancies.',
      'Training institutes and professional certification providers.',
      'EdTech businesses with a defined programme or learning offer.',
    ],
    problem: {
      title: 'An enquiry needs an informed next step.',
      paragraphs: [
        'Broad promotion can generate interest without programme fit. When admissions teams cannot see the source, requirements or follow-up status, an enquiry may never become a useful counselling conversation.',
        'We align programme information, targeting and qualification with the counselling process. Eligibility, fees, accreditation, deadlines and admission claims must come from the institution and be checked before publication.',
      ],
    },
    journey: [
      {
        title: 'Awareness',
        copy: 'Relevant programme information reaches prospective students.',
      },
      {
        title: 'Enquiry',
        copy: 'A student asks for information or a conversation.',
      },
      {
        title: 'Qualification',
        copy: 'Programme interest and fit are checked.',
      },
      {
        title: 'Counselling',
        copy: 'The institution explains options and requirements.',
      },
      {
        title: 'Application',
        copy: 'The student and institution complete the required steps.',
      },
      {
        title: 'Admission',
        copy: 'The institution confirms the admission outcome.',
      },
    ],
    work: [
      {
        title: 'Plan around the programme',
        copy: 'Agree priority courses, prospective-student profiles, capacity and the institution’s verified deadlines.',
      },
      {
        title: 'Make the information clear',
        copy: 'Connect search, campaign messages and landing pages to accurate programme details and a proportionate enquiry path.',
      },
      {
        title: 'Support qualification and follow-up',
        copy: 'Record programme interest, route enquiries and support counselling booking within the agreed scope.',
      },
      {
        title: 'Track progression',
        copy: 'Use the institution’s records to connect enquiries, counselling, applications and confirmed admissions where available.',
      },
    ],
    agency:
      'Markevance can support demand generation, enquiry capture, qualification, follow-up systems and counselling booking within the agreed scope.',
    client:
      'The institution owns programme accuracy, eligibility decisions, counselling, application requirements and final admissions. We do not guarantee admission, visas, scholarships or student outcomes.',
    measures: [
      'Enquiries by programme and source',
      'Qualified-enquiry rate',
      'Counselling booked and attended',
      'Applications recorded',
      'Admissions confirmed by the institution',
      'Cost per stage where attributable',
    ],
    related: [
      { label: 'Paid Acquisition', href: '/services/paid-acquisition/' },
      { label: 'SEO + AEO + GEO', href: '/services/seo-aeo-geo/' },
      { label: 'CRM & Automation', href: '/services/crm-automation/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
];
