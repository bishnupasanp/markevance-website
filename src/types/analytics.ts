export const analyticsEventNames = [
  'consultation_cta_clicked',
  'consultation_form_started',
  'consultation_form_submitted',
  'consultation_booked',
  'contact_form_submitted',
  'phone_clicked',
  'email_clicked',
  'service_cta_clicked',
  'case_study_viewed',
  'newsletter_signup',
] as const;
export type AnalyticsEventName = (typeof analyticsEventNames)[number];
export type AnalyticsPlacement = 'header' | 'footer' | 'page' | 'form';
export interface AnalyticsEvent {
  name: AnalyticsEventName;
  placement?: AnalyticsPlacement;
  // Successful submissions/booking require reliable downstream confirmation.
  confirmed?: boolean;
}
export type AnalyticsAdapter = (event: Readonly<AnalyticsEvent>) => void;
