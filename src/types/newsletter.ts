export type NewsletterPlacement = 'inline' | 'footer';
export type NewsletterField = 'workEmail' | 'firstName' | 'consent';

export interface NewsletterSubscription {
  workEmail: string;
  firstName?: string;
  consent: true;
  placement: NewsletterPlacement;
}

export type NewsletterValidation =
  | { valid: true; subscription: NewsletterSubscription }
  | { valid: false; errors: Partial<Record<NewsletterField, string>> };

export type NewsletterAcceptance = {
  accepted: true;
  subscriptionStored: true;
  reference: string;
} & (
  | { status: 'subscribed' }
  | { status: 'confirmation-required'; confirmationSent: true }
);

// Provider-specific credentials and subscriber writes belong to a secure endpoint.
export type NewsletterTransport = (
  subscription: NewsletterSubscription,
  signal?: AbortSignal,
) => Promise<unknown>;

export type NewsletterResult =
  | { status: 'subscribed'; reference: string }
  | { status: 'confirmation-required'; reference: string }
  | { status: 'invalid'; errors: Partial<Record<NewsletterField, string>> }
  | { status: 'unavailable'; message: string }
  | { status: 'error'; message: string };
