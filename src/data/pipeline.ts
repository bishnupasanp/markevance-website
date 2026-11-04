interface PipelineStage {
  slug: string;
  name: string;
  headline: string;
  description: string;
  responsibility: string;
  measure: string;
}

// Commercial stages are separate from the shorter hero and operating-method labels.
export const pipelineStages: readonly PipelineStage[] = [
  {
    slug: 'traffic',
    name: 'Traffic',
    headline: 'Reach the market that matters.',
    description:
      'Search, paid acquisition, content and targeted outreach bring relevant people into the journey. The next question is whether that attention becomes identifiable interest.',
    responsibility: 'Markevance · demand generation',
    measure: 'Relevant visits and acquisition sources',
  },
  {
    slug: 'lead',
    name: 'Lead',
    headline: 'Give interest a clear next step.',
    description:
      'A useful landing page and clear conversion path help a visitor make an enquiry. Contact information and business context make follow-up possible.',
    responsibility: 'Markevance · capture and routing',
    measure: 'Enquiries and conversion rate',
  },
  {
    slug: 'qualified-lead',
    name: 'Qualified Lead',
    headline: 'Establish fit before adding sales pressure.',
    description:
      'Research, requirement discovery and qualification distinguish relevant prospects from poor-fit enquiries. Timing and readiness inform whether to progress, nurture or decline.',
    responsibility: 'Markevance · research and qualification',
    measure: 'Qualified-lead rate and cost per qualified lead',
  },
  {
    slug: 'meeting',
    name: 'Meeting',
    headline: 'Make the conversation worth having.',
    description:
      'Follow-up and meeting booking connect a qualified prospect with the client team. The handoff includes the requirement, context and agreed next step.',
    responsibility: 'Markevance → client sales team',
    measure: 'Meetings booked and meetings held',
  },
  {
    slug: 'opportunity',
    name: 'Opportunity',
    headline: 'Turn the conversation into a sales decision.',
    description:
      'The client explores the requirement, runs technical demos where needed and develops the proposal. CRM stages make ownership and the next action visible.',
    responsibility: 'Client · demos, proposals and pricing',
    measure: 'Sales-accepted opportunities and pipeline value',
  },
  {
    slug: 'customer',
    name: 'Customer',
    headline: 'Keep the close with the people who deliver.',
    description:
      'The client handles negotiation, commitments and closing unless a separate scope is agreed. Confirmed outcomes feed back into acquisition and qualification decisions.',
    responsibility: 'Client · negotiation and closing',
    measure: 'Won opportunities and acquisition cost',
  },
  {
    slug: 'revenue',
    name: 'Revenue',
    headline: 'Connect the outcome back to the system.',
    description:
      'Where reliable sales data is available, connect customers and revenue with their acquisition journey. Review attribution limits alongside the results before deciding what to scale.',
    responsibility: 'Shared · reporting and interpretation',
    measure: 'Revenue attribution where available',
  },
];
