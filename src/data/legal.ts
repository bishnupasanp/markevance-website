import type { LegalDefinition } from '../types/public-pages.ts';

// Current website behaviour only. Owner/legal approval, hosting/log details and
// a verified privacy contact are launch gates in docs/public-site-v1.md.
// Do not mark these routes indexable until those gates are resolved.
export const legalPages: readonly LegalDefinition[] = [
  {
    path: '/privacy-policy/',
    reviewPending: true,
    title: 'Privacy Policy',
    description:
      'How the Markevance website handles browsing, consultation enquiries through Formspree and unavailable newsletter subscriptions.',
    intro:
      'This page describes the information-handling features currently present on the Markevance website.',
    sections: [
      {
        id: 'operator',
        title: 'Who is responsible',
        paragraphs: [
          'Markevance is currently operated by Bishnu Nakarmi in Nepal. Registration as a private limited company in Nepal is planned; this website does not represent Markevance as an incorporated company. The operator details will be updated after registration.',
          'For privacy questions, use the current contact address, growwith@markevance.com. A dedicated privacy mailbox at privacy@markevance.com is planned but is not yet confirmed operational; please use the current contact address until the new mailbox is available.',
        ],
      },
      {
        id: 'browsing',
        title: 'Browsing the website',
        paragraphs: [
          'You can read the public pages without creating an account. This website has no client login, payment flow or public dashboard.',
          'The page, style, script and font files are delivered as website assets. Fonts are hosted with the site rather than requested from a runtime Google Fonts service.',
        ],
      },
      {
        id: 'enquiries',
        title: 'Consultation and contact',
        paragraphs: [
          'Submitting the consultation form sends the details you provide to Formspree to process your enquiry and notify Markevance. The form asks for your name, email, company or institution, industry, growth challenge and objective. Website, phone, team size and current customer-acquisition method are optional. The consultation page path accompanies the request; attribution query strings are not added to the form payload.',
          'The form continues to Formspree for spam verification and confirmation. Formspree and its reCAPTCHA service may process connection and browser information under their own practices. Submission acceptance is not confirmation of email delivery or a booked meeting. Markevance uses the information to respond to and assess your enquiry.',
          'No calendar booking, Google Sheets connection or CRM integration is active. Please do not include sensitive personal information in your enquiry.',
        ],
      },
      {
        id: 'access',
        title: 'Who can access enquiries',
        paragraphs: [
          'Within Markevance, only Bishnu Nakarmi currently accesses enquiries to assess requests, respond and discuss potential services.',
          'Formspree processes form submissions and sends notification emails to an inbox hosted by Google/Gmail. These providers process information as part of providing their services; the restriction on internal access does not mean that providers have no access. Formspree’s hosted reCAPTCHA verification may also process information under the verification provider’s practices.',
        ],
      },
      {
        id: 'retention',
        title: 'How long enquiry information is kept',
        paragraphs: [
          'Unsuccessful enquiries that do not lead to a client engagement are deleted six months after the last meaningful contact. This schedule covers the submission records, notification emails and exported copies under Markevance’s control. It is Markevance’s chosen retention period, not a universal statutory deadline.',
          'When an enquiry becomes a client engagement, relevant information is transferred to the client record and kept while needed to provide the services and manage the relationship. Unnecessary duplicate enquiry copies are deleted.',
          'Contracts, invoices, tax records and information needed for legal claims are handled separately and retained where required by applicable law or necessary for a specific legal claim. A fixed post-engagement retention period for these records remains subject to legal and accounting review; the six-month unsuccessful-enquiry rule does not apply to them.',
          'Provider-controlled backups and logs may follow separate retention schedules. Those schedules and the hosting provider’s handling remain under review; this policy does not promise immediate erasure from provider backups.',
        ],
      },
      {
        id: 'newsletter',
        title: 'Newsletter subscriptions',
        paragraphs: [
          'Newsletter subscriptions are currently unavailable. No newsletter signup is displayed, and no email address or name is sent to a newsletter provider.',
          'No subscription, confirmation email or mailing-list entry is created by visiting the site.',
        ],
      },
      {
        id: 'tracking',
        title: 'Analytics and browser storage',
        paragraphs: [
          'The website application currently has no analytics or visitor-tracking provider connected and does not use cookies, local storage or session storage to create a visitor profile.',
          'Website delivery is separate from these application features. The hosting server may process ordinary connection information or access logs when serving a page. The site does not offer an account interface for viewing server records; hosting-provider practices require separate review.',
        ],
      },
      {
        id: 'changes',
        title: 'Changes to website features',
        paragraphs: [
          'Consultation requests use Formspree. Newsletter subscriptions, Google Sheets lead storage, CRM contact sync and calendar booking are not active. No third-party analytics or visitor-tracking script is currently connected.',
          'These policies are pending owner and legal review and must be updated if website features, providers or data handling change.',
          'For the current status of enquiries, visit Contact or Book a Growth Consultation. The Cookie Policy describes the application’s current cookie and browser-storage behaviour.',
        ],
      },
    ],
  },
  {
    path: '/terms/',
    reviewPending: true,
    title: 'Terms of Website Use',
    description:
      'Information about using the Markevance website, service descriptions, illustrative diagrams and the current availability of enquiries.',
    intro:
      'These terms explain the purpose and current availability of this website. A service engagement requires a separate written agreement.',
    sections: [
      {
        id: 'purpose',
        title: 'Purpose of this website',
        paragraphs: [
          'The website explains Markevance’s growth marketing and sales-development capabilities. Its content supports a business discussion; it does not define an agreed service scope, fee, delivery schedule or client commitment.',
          'Services described on the site are selected and scoped for an engagement. Reading a page or following a consultation link does not create a service agreement.',
        ],
      },
      {
        id: 'outcomes',
        title: 'Outcomes and examples',
        paragraphs: [
          'Process diagrams are illustrative explanations of how marketing, qualification and sales can connect. They are not client results or evidence of completed work.',
          'The website does not guarantee rankings, leads, meetings, admissions, customers or revenue. Commercial outcomes depend on the offer, market, execution and client responsibilities.',
        ],
      },
      {
        id: 'availability',
        title: 'Enquiries and bookings',
        paragraphs: [
          'Consultation requests continue to Formspree for verification and confirmation. Opening a confirmation page on this website does not prove that a submission was accepted, delivered by email or booked. Newsletter subscriptions remain unavailable.',
          'No online payment or checkout is offered. A consultation CTA is navigation to the consultation information page, not confirmation of a booking.',
        ],
      },
      {
        id: 'responsibilities',
        title: 'Responsibilities in a service engagement',
        paragraphs: [
          'For sales-development work, Markevance’s initial scope can include research, outreach, qualification, follow-up and meeting booking. Technical demos, detailed pricing, negotiation and final closing remain with the client unless separately agreed.',
          'Education institutions remain responsible for programme information, eligibility, counselling and final admissions. Any service engagement must identify its own agency and client responsibilities in writing.',
        ],
      },
      {
        id: 'references',
        title: 'Links and supporting information',
        paragraphs: [
          'Links may point to related Markevance pages or identified external reference material. External platforms maintain their own content and practices.',
          'For current website data handling and tracking information, read the Privacy Policy and Cookie Policy.',
        ],
      },
    ],
  },
  {
    path: '/cookie-policy/',
    reviewPending: true,
    title: 'Cookie Policy',
    description:
      'Cookie and browser-storage information for the Markevance website.',
    intro:
      'This page describes cookie and browser-storage behaviour in the current website application.',
    sections: [
      {
        id: 'current-cookies',
        title: 'Current application behaviour',
        paragraphs: [
          'The website application currently sets no analytics or visitor-tracking cookies and does not use local storage or session storage to keep enquiry details or subscription information.',
          'Consultation details are submitted to Formspree when you send a request. They are not saved by this application in local storage or session storage. Newsletter signup is not active. The navigation menu and process diagrams keep their interactive state only while the page is open.',
        ],
      },
      {
        id: 'third-parties',
        title: 'Optional tracking and embeds',
        paragraphs: [
          'No third-party analytics, advertising pixel, external calendar or newsletter provider is active. Local fonts do not create a runtime request to Google Fonts. The consultation form navigates to Formspree for submission and reCAPTCHA verification; no Google reCAPTCHA script or embedded widget is loaded on the Markevance page. Cookies or storage on the provider’s verification pages are governed by that provider’s practices.',
          'The hosting or delivery provider may process request information separately from application cookies. Its practices should be reviewed with the provider.',
        ],
      },
      {
        id: 'delivery',
        title: 'Website delivery and browser controls',
        paragraphs: [
          'These statements describe the application, rather than every possible hosting or network feature. A server or delivery provider can have separate request-handling practices.',
          'Your browser provides settings for reviewing and controlling cookies and stored site data. Clearing stored data does not submit an enquiry or create a subscription on Markevance.',
        ],
      },
      {
        id: 'future-tracking',
        title: 'Consent and visitor choices',
        paragraphs: [
          'No analytics or optional tracking provider is currently connected, and this website does not include cookie-preference controls. Any future tracking or embedded provider must be reviewed for applicable consent and disclosure requirements before it is enabled.',
          'Visitors can use browser settings to review or clear stored cookies. The Privacy Policy describes current website data handling and the status of enquiries and subscriptions. These policies remain subject to owner and legal review.',
        ],
      },
    ],
  },
];
