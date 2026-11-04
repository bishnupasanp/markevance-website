import type { ServiceDefinition } from '../types/public-pages.ts';

// Approved capability scope from BUSINESS, OFFERS and the V1 completion brief.
// Measures describe what an engagement tracks, never achieved client results.
export const services: readonly ServiceDefinition[] = [
  {
    path: '/services/b2b-lead-generation/',
    name: 'B2B Lead Generation',
    title: 'B2B Lead Generation in Nepal',
    headline: 'Build a pipeline your sales team can work.',
    description:
      'B2B lead generation for technology and software businesses in Nepal: targeting, demand generation, lead capture and qualification connected to sales.',
    intro:
      'Connect the right target accounts, a clear buying problem and a useful next conversation. Markevance brings inbound marketing and outbound prospecting into one lead-generation process.',
    problem: {
      title: 'A contact list is only the starting point.',
      paragraphs: [
        'More traffic or more names will not resolve an unclear offer, weak qualification or a missing sales handoff. A workable lead needs a relevant company, a reason to engage and enough context for the next conversation.',
        'We start by agreeing what a qualified lead means for your business. That definition guides targeting, campaign messages, enquiry fields and the information handed to your sales team.',
      ],
    },
    audience: [
      'Software and technology companies with a working product and existing customers.',
      'B2B service businesses with a defined buyer and someone available to handle sales conversations.',
      'Founders and sales leaders who need a structured alternative to referral-only acquisition.',
    ],
    work: [
      {
        title: 'Define the target',
        copy: 'Map company fit, decision makers, buying problems and disqualifiers. Separate account research from evidence of buying intent.',
      },
      {
        title: 'Create demand',
        copy: 'Build relevant search, paid, content and outbound activity around the offer. Select channels for the buyer and sales cycle.',
      },
      {
        title: 'Capture and qualify',
        copy: 'Connect landing pages and enquiries to clear qualification questions, source information and a named follow-up owner.',
      },
      {
        title: 'Prepare the handoff',
        copy: 'Document fit, expressed requirements and agreed next steps so the client can continue the conversation without starting again.',
      },
    ],
    process: [
      { title: 'Target', copy: 'Agree account and buyer fit.' },
      {
        title: 'Engage',
        copy: 'Reach buyers with a relevant problem and offer.',
      },
      { title: 'Qualify', copy: 'Check fit, interest and readiness.' },
      { title: 'Handoff', copy: 'Give sales an actionable next step.' },
    ],
    connection:
      'Demand generation brings relevant attention into the system. Lead capture and qualification turn that attention into a conversation that sales can evaluate. Fractional SDR support can develop the conversation when follow-up capacity is the bottleneck.',
    outcomes:
      'The aim is a clearer source of relevant enquiries and a consistent definition of lead quality. Volume and commercial results depend on the market, offer, channel investment and client sales follow-through.',
    measures: [
      'Enquiries by source',
      'Qualified-lead rate',
      'Cost per qualified lead where measurable',
      'Accepted sales handoffs',
      'Meeting progression',
      'Disqualification reasons',
    ],
    boundary:
      'Markevance can support research, outreach, qualification, follow-up and meeting booking. The client owns technical demos, detailed pricing, negotiation and final closing unless separately agreed. Purchased contact data is not presented as qualified demand.',
    related: [
      {
        label: 'Technology & Software',
        href: '/industries/technology-software/',
      },
      { label: 'Fractional SDR', href: '/services/fractional-sdr/' },
      { label: 'Paid Acquisition', href: '/services/paid-acquisition/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
  {
    path: '/services/paid-acquisition/',
    name: 'Paid Acquisition',
    title: 'Paid Acquisition & Advertising in Nepal',
    headline: 'Connect paid attention to qualified demand.',
    description:
      'Paid acquisition planning and campaign management for technology and education businesses, connecting advertising, landing pages and lead-quality measurement.',
    intro:
      'Build advertising around a commercial objective, the right audience and a measurable enquiry journey. Markevance connects campaign decisions with what happens after the click.',
    problem: {
      title: 'A cheaper click can still become an expensive enquiry.',
      paragraphs: [
        'Campaign reporting can look encouraging while sales or admissions teams struggle with irrelevant enquiries. The problem may sit in targeting, the promise in the ad, the landing page or the follow-up process.',
        'We review that whole path before increasing spend. Lead quality and downstream progress help determine which campaigns should continue, change or stop.',
      ],
    },
    audience: [
      'Technology and software companies with a clear offer and sales capacity.',
      'Colleges, consultancies and training providers with defined programmes and intake priorities.',
      'Businesses able to fund advertising separately from agency work and share enquiry outcomes.',
    ],
    work: [
      {
        title: 'Plan the acquisition route',
        copy: 'Match the offer and audience to Google Ads, Meta or LinkedIn where appropriate. Agree budget boundaries, conversion definitions and test priorities.',
      },
      {
        title: 'Align ad and landing page',
        copy: 'Develop messages, creative direction and enquiry pages that explain the same proposition. Make the next action specific and usable on mobile.',
      },
      {
        title: 'Connect measurement',
        copy: 'Check conversion events and source information. Use qualified-enquiry feedback alongside platform metrics, with consent where required.',
      },
      {
        title: 'Review and adjust',
        copy: 'Inspect search terms, audiences, creative and lead quality. Keep a record of changes and the reason for each test.',
      },
    ],
    process: [
      { title: 'Plan', copy: 'Choose the offer, audience and budget.' },
      { title: 'Launch', copy: 'Connect ads to a relevant landing page.' },
      { title: 'Evaluate', copy: 'Review enquiries and their quality.' },
      { title: 'Refine', copy: 'Change the parts supported by evidence.' },
    ],
    connection:
      'Paid media sits in Generate Demand. Its value depends on Capture Interest, Qualify and Develop working together. Advertising reports should connect to sales or counselling progress wherever reliable data is available.',
    outcomes:
      'Expect an accountable testing process and visibility into enquiry quality. We do not guarantee a cost per lead, return on ad spend or admission count before understanding the offer and market.',
    measures: [
      'Advertising spend',
      'Landing-page enquiries',
      'Cost per enquiry',
      'Qualified-enquiry rate',
      'Meeting or counselling progression',
      'Attribution limitations',
    ],
    boundary:
      'Advertising spend is separate from agency fees. Platform selection, budget and access are agreed for each engagement. Revenue or admission attribution is reported only where the underlying records support it.',
    related: [
      { label: 'Education', href: '/industries/education/' },
      { label: 'B2B Lead Generation', href: '/services/b2b-lead-generation/' },
      { label: 'CRM & Automation', href: '/services/crm-automation/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
  {
    path: '/services/seo-aeo-geo/',
    name: 'SEO + AEO + GEO',
    title: 'SEO, AEO & GEO Services in Nepal',
    headline: 'Make your expertise easier to find and understand.',
    description:
      'Connected SEO, answer-engine and AI-search visibility work: technical foundations, useful content, clear entities and measurement for Nepal-first businesses.',
    intro:
      'Treat search visibility as one connected discipline. Markevance works on technical access, relevant content and credible information that helps buyers evaluate your business.',
    problem: {
      title: 'Being discoverable starts with being useful.',
      paragraphs: [
        'A site can contain the right keywords and still leave buyers unable to understand the offer. Unclear page intent, thin answers, weak internal links and technical indexing problems all deserve attention.',
        'SEO addresses organic search discovery. AEO focuses on making answers clear and usable. GEO considers visibility in generative search experiences. We connect these goals through accurate, accessible content rather than separate keyword pages.',
      ],
    },
    audience: [
      'Software and technology businesses with complex offers that need clear explanations.',
      'Education providers whose programme information must be accurate and easy to compare.',
      'Businesses prepared to contribute real expertise and review content before publication.',
    ],
    work: [
      {
        title: 'Audit the foundations',
        copy: 'Review crawl access, indexing, canonical URLs, site structure, mobile usability and important performance constraints.',
      },
      {
        title: 'Map search intent',
        copy: 'Assign each commercial page a distinct buyer question. Plan supporting content only where it adds useful depth.',
      },
      {
        title: 'Build credible answers',
        copy: 'Develop clear service and industry explanations, definitions and FAQs. Use real authorship, evidence and truthful structured data where appropriate.',
      },
      {
        title: 'Measure useful discovery',
        copy: 'Review available query, landing-page and enquiry data. Separate observable search performance from unverified AI-visibility claims.',
      },
    ],
    process: [
      { title: 'Audit', copy: 'Find access and content gaps.' },
      { title: 'Map', copy: 'Give each page a clear buyer purpose.' },
      { title: 'Publish', copy: 'Add useful, accurate information.' },
      { title: 'Review', copy: 'Measure discovery and business relevance.' },
    ],
    connection:
      'Search supports Generate Demand and Capture Interest. Relevant commercial pages help visitors move from a question to an enquiry; qualification and follow-up determine what happens next.',
    outcomes:
      'The aim is stronger technical foundations, clearer content and a measurable discovery process. Rankings, traffic and inclusion in AI-generated answers are not guaranteed. Google states that its AI search features require no additional special markup.',
    measures: [
      'Indexing of important pages',
      'Relevant search queries',
      'Organic landing-page visits',
      'Enquiries from search',
      'Content accuracy and coverage',
      'Observed AI referrals where available',
    ],
    boundary:
      'We do not promise rankings, guaranteed AI citations or special AI-only schema. Search platforms control their results. Publication and review are ongoing work, and content must be backed by the client’s actual knowledge.',
    related: [
      {
        label: 'Technology & Software',
        href: '/industries/technology-software/',
      },
      { label: 'Education', href: '/industries/education/' },
      { label: 'B2B Lead Generation', href: '/services/b2b-lead-generation/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
  {
    path: '/services/fractional-sdr/',
    name: 'Fractional SDR',
    title: 'Fractional SDR & Sales Development in Nepal',
    headline: 'Give promising conversations a clear next step.',
    description:
      'Fractional sales-development support for B2B businesses: prospect research, outreach, qualification, follow-up and meeting booking with a clear client handoff.',
    intro:
      'Add structured sales-development capacity without immediately building a full internal SDR function. Markevance supports the work between identifying a prospect and booking a relevant sales conversation.',
    problem: {
      title: 'Interest loses value when nobody owns the follow-up.',
      paragraphs: [
        'A founder may be handling prospect research, first contact, follow-up and every sales meeting. An existing sales team may have capacity to close but little time to develop new conversations.',
        'Fractional SDR support gives those earlier steps an owner and a documented process. Qualification criteria and the client handoff are agreed before outreach begins.',
      ],
    },
    audience: [
      'B2B technology and software businesses with an established product and defined market.',
      'Sales teams that need prospecting or follow-up support while retaining demo and closing responsibility.',
      'Founders who can provide product knowledge and attend qualified sales conversations.',
    ],
    work: [
      {
        title: 'Research prospects',
        copy: 'Build account and decision-maker context around agreed fit criteria. Validate contact information and relevance before outreach.',
      },
      {
        title: 'Start relevant conversations',
        copy: 'Use approved email, LinkedIn or calling approaches where appropriate. Respect applicable platform, privacy and outreach requirements.',
      },
      {
        title: 'Qualify and follow up',
        copy: 'Understand the prospect’s situation, record interest and fit, and maintain clear next actions in the agreed lead register or CRM.',
      },
      {
        title: 'Book and brief',
        copy: 'Arrange a relevant meeting and provide context to the client. Review accepted meetings and reasons for rejected handoffs.',
      },
    ],
    process: [
      { title: 'Research', copy: 'Identify relevant accounts and people.' },
      { title: 'Outreach', copy: 'Begin a specific, relevant conversation.' },
      { title: 'Qualify', copy: 'Establish fit and the next action.' },
      { title: 'Book', copy: 'Prepare the client’s sales conversation.' },
    ],
    connection:
      'Fractional SDR strengthens Qualify and Develop. It can work with leads from paid acquisition and search, or with targeted outbound research as part of the B2B Pipeline Engine.',
    outcomes:
      'Expect an accountable follow-up process, clearer prospect context and a defined handoff. Meeting volume depends on the offer, addressable market, outreach approach and prospect response.',
    measures: [
      'Relevant conversations',
      'Qualification outcomes',
      'Meetings booked and attended',
      'Client-accepted handoffs',
      'Follow-up completion',
      'Disqualification reasons',
    ],
    boundary:
      'Markevance handles research, outreach, qualification, follow-up, CRM updates and meeting booking within the agreed scope. Technical demos, detailed pricing, negotiation, commitments and final closing remain with the client unless separately agreed.',
    related: [
      {
        label: 'Technology & Software',
        href: '/industries/technology-software/',
      },
      { label: 'B2B Lead Generation', href: '/services/b2b-lead-generation/' },
      { label: 'CRM & Automation', href: '/services/crm-automation/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
  {
    path: '/services/crm-automation/',
    name: 'CRM & Automation',
    title: 'CRM & Marketing Automation Support in Nepal',
    headline: 'Make the next action visible.',
    description:
      'CRM and follow-up process support for technology and education businesses: lead stages, ownership, handoffs, practical automation and accountable reporting.',
    intro:
      'Build a lead-management process your team can actually maintain. Markevance connects enquiry sources, clear stages, assigned ownership and useful follow-up automation.',
    problem: {
      title: 'The system needs to reflect how your team works.',
      paragraphs: [
        'Enquiries may arrive across forms, calls and messages while follow-up lives in individual inboxes or spreadsheets. Without a shared definition of stages, it is difficult to see which leads need action.',
        'Buying a CRM does not establish that process. We map the journey and responsibilities first, then configure the appropriate existing or agreed tools. A private, structured lead register may be enough for an early operation.',
      ],
    },
    audience: [
      'Businesses with enquiries but inconsistent ownership or follow-up records.',
      'Sales and admissions teams that need a shared view of the next action.',
      'Companies prepared to assign process owners and keep lead records current.',
    ],
    work: [
      {
        title: 'Map the lead journey',
        copy: 'Define source fields, useful lead information and stage criteria. Identify where enquiries lose context or ownership.',
      },
      {
        title: 'Configure the working system',
        copy: 'Set up the agreed lead register or CRM with roles, stages, views and handoff requirements. Use existing tools where they are suitable.',
      },
      {
        title: 'Automate specific tasks',
        copy: 'Connect approved enquiry routing, reminders or status updates where they reduce manual work. Test failures and duplicate handling before use.',
      },
      {
        title: 'Make reporting usable',
        copy: 'Create a consistent view of open leads, stage movement and follow-up. Document the process and responsibilities for the team.',
      },
    ],
    process: [
      { title: 'Map', copy: 'Define stages and responsibilities.' },
      { title: 'Configure', copy: 'Make the process visible in the tools.' },
      { title: 'Test', copy: 'Check handoffs and failure handling.' },
      { title: 'Maintain', copy: 'Keep records and ownership current.' },
    ],
    connection:
      'CRM and automation connect Capture Interest, Qualify, Develop and Measure. They support the growth process; they do not replace relevant demand or the client’s sales and admissions judgment.',
    outcomes:
      'The aim is fewer unclear handoffs, more consistent records and a reliable view of follow-up. Automation is scoped around real operational needs rather than a custom application or unnecessary dashboard.',
    measures: [
      'Lead source completeness',
      'Assigned lead ownership',
      'Follow-up completion',
      'Stage movement',
      'Duplicate and missing records',
      'Qualified-lead to meeting progression',
    ],
    boundary:
      'Tool choice, access and any provider costs are agreed before implementation. Client data remains private.',
    related: [
      { label: 'Education', href: '/industries/education/' },
      { label: 'Fractional SDR', href: '/services/fractional-sdr/' },
      { label: 'B2B Lead Generation', href: '/services/b2b-lead-generation/' },
      { label: 'How We Work', href: '/how-we-work/' },
    ],
  },
];
