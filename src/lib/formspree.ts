import type {
  ConsultationLead,
  LeadSubmissionTransport,
} from '../types/forms.ts';

// Public form address, approved by the owner. Recipient settings live in Formspree.
export const consultationEndpoint = 'https://formspree.io/f/mvkzleqv';

export function resolveFormspreeEndpoint(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  // Exact origin/path structure prevents credentials, query strings and open redirects.
  return /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]{8,32}$/.test(value)
    ? value
    : undefined;
}

export function isConsultationHost(hostname: string): boolean {
  return hostname === 'markevance.com' || hostname.endsWith('.markevance.com');
}

export function formspreeFields(
  lead: ConsultationLead,
): Record<string, string> {
  return {
    _subject: 'Markevance — Growth Consultation',
    name: lead.name,
    email: lead.workEmail,
    company: lead.company,
    industry: lead.industry,
    challenge: lead.growthChallenge,
    objective: lead.objective,
    sourcePath: lead.landingPath,
    ...(lead.website ? { website: lead.website } : {}),
    ...(lead.phone ? { phone: lead.phone } : {}),
    ...(lead.employeeCount ? { employeeCount: lead.employeeCount } : {}),
    ...(lead.acquisitionMethods.length
      ? { acquisition: lead.acquisitionMethods.join(', ') }
      : {}),
  };
}

export interface NativeFormRequest {
  action: string;
  fields: Readonly<Record<string, string>>;
}

// Hosted CAPTCHA needs a document navigation. A handoff is never acceptance or
// email-delivery proof; Formspree owns the subsequent verification/error page.
export function createFormspreeTransport(
  endpoint: unknown,
  navigate: (request: NativeFormRequest) => void,
): LeadSubmissionTransport | undefined {
  const action = resolveFormspreeEndpoint(endpoint);
  if (!action) return undefined;
  return async (lead, signal) => {
    if (signal?.aborted) throw new Error('Submission interrupted');
    navigate({ action, fields: formspreeFields(lead) });
    return { handedOff: true };
  };
}
