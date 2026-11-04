import { newsletterCopy } from '../data/newsletter.ts';
import type {
  NewsletterAcceptance,
  NewsletterField,
  NewsletterResult,
  NewsletterTransport,
  NewsletterValidation,
} from '../types/newsletter.ts';

export function validateNewsletterSubscription(
  value: unknown,
): NewsletterValidation {
  if (typeof value !== 'object' || value === null) {
    return { valid: false, errors: { workEmail: 'Enter a valid work email.' } };
  }
  const errors: Partial<Record<NewsletterField, string>> = {};
  const workEmail =
    'workEmail' in value && typeof value.workEmail === 'string'
      ? value.workEmail.trim()
      : '';
  if (
    workEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail) ||
    /[\u0000-\u001f\u007f]/.test(workEmail)
  ) {
    errors.workEmail = 'Enter a valid work email (up to 254 characters).';
  }
  const firstName =
    'firstName' in value && typeof value.firstName === 'string'
      ? value.firstName.trim()
      : '';
  if (
    ('firstName' in value &&
      value.firstName !== undefined &&
      typeof value.firstName !== 'string') ||
    firstName.length > 80 ||
    /[\u0000-\u001f\u007f]/.test(firstName)
  ) {
    errors.firstName =
      'Use a first name of up to 80 characters without control characters.';
  }
  if (!('consent' in value) || value.consent !== true) {
    errors.consent =
      'Please agree to receive Markevance insights before subscribing.';
  }
  const placement = 'placement' in value ? value.placement : undefined;
  if (placement !== 'inline' && placement !== 'footer') {
    return {
      valid: false,
      errors: {
        ...errors,
        workEmail: 'This form is unavailable. Please reload the page.',
      },
    };
  }
  if (Object.keys(errors).length > 0) return { valid: false, errors };
  return {
    valid: true,
    subscription: {
      workEmail,
      ...(firstName ? { firstName } : {}),
      consent: true,
      placement,
    },
  };
}

export function isNewsletterAcceptance(
  value: unknown,
): value is NewsletterAcceptance {
  if (typeof value !== 'object' || value === null) return false;
  return (
    'accepted' in value &&
    value.accepted === true &&
    'subscriptionStored' in value &&
    value.subscriptionStored === true &&
    'reference' in value &&
    typeof value.reference === 'string' &&
    value.reference.trim().length > 0 &&
    value.reference.length <= 128 &&
    'status' in value &&
    (value.status === 'subscribed' ||
      (value.status === 'confirmation-required' &&
        'confirmationSent' in value &&
        value.confirmationSent === true))
  );
}

export async function submitNewsletter(
  value: unknown,
  transport?: NewsletterTransport,
  signal?: AbortSignal,
): Promise<NewsletterResult> {
  if (!transport)
    return { status: 'unavailable', message: newsletterCopy.unavailable };
  const validation = validateNewsletterSubscription(value);
  if (!validation.valid)
    return { status: 'invalid', errors: validation.errors };
  if (signal?.aborted)
    return {
      status: 'error',
      message: 'Subscription was interrupted. Please try again.',
    };
  try {
    const result = await transport(validation.subscription, signal);
    if (signal?.aborted)
      return {
        status: 'error',
        message: 'Subscription was interrupted. Please try again.',
      };
    if (!isNewsletterAcceptance(result)) {
      return {
        status: 'error',
        message: 'We could not confirm your subscription. Please try again.',
      };
    }
    return { status: result.status, reference: result.reference };
  } catch {
    return {
      status: 'error',
      message: 'Your subscription could not be completed. Please try again.',
    };
  }
}
