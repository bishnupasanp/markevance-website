import { validateConsultationLead } from './lead-validation.ts';
import type {
  LeadAcceptance,
  LeadSubmissionResult,
  LeadSubmissionTransport,
} from '../types/forms.ts';

export function isLeadAcceptance(value: unknown): value is LeadAcceptance {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'accepted' in value &&
    value.accepted === true &&
    'leadStored' in value &&
    value.leadStored === true &&
    'reference' in value &&
    typeof value.reference === 'string' &&
    value.reference.trim().length > 0 &&
    value.reference.length <= 128 &&
    'notificationSent' in value &&
    value.notificationSent === true
  );
}

export async function submitLead(
  lead: unknown,
  transport?: LeadSubmissionTransport,
  signal?: AbortSignal,
): Promise<LeadSubmissionResult> {
  if (!transport) {
    return {
      status: 'unavailable',
      message:
        'Consultation submission is not connected yet. No enquiry has been sent.',
    };
  }
  const payload = validateConsultationLead(lead);
  if (!payload)
    return {
      status: 'invalid',
      message: 'Check the consultation details and try again.',
    };
  if (signal?.aborted)
    return {
      status: 'error',
      message: 'Submission was interrupted. Please try again.',
    };
  try {
    const result = await transport(payload, signal);
    if (signal?.aborted)
      return {
        status: 'error',
        message: 'Submission was interrupted. Please try again.',
      };
    if (
      typeof result === 'object' &&
      result !== null &&
      'handedOff' in result &&
      result.handedOff === true
    )
      return { status: 'handoff' };
    if (!isLeadAcceptance(result))
      return {
        status: 'error',
        message: 'The submission could not be confirmed. Please try again.',
      };
    return { status: 'accepted', reference: result.reference };
  } catch {
    return {
      status: 'error',
      message: 'The submission could not be completed. Please try again.',
    };
  }
}
