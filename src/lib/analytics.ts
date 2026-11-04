import { analyticsEventNames } from '../types/analytics.ts';
import type {
  AnalyticsAdapter,
  AnalyticsEvent,
  AnalyticsEventName,
  AnalyticsPlacement,
} from '../types/analytics.ts';

const conversionEvents: readonly AnalyticsEventName[] = [
  'consultation_form_submitted',
  'contact_form_submitted',
  'consultation_booked',
  'newsletter_signup',
];
const placements: readonly AnalyticsPlacement[] = [
  'header',
  'footer',
  'page',
  'form',
];

export function createAnalytics(adapter?: AnalyticsAdapter) {
  let consent = false;
  return {
    setConsent(granted: boolean): void {
      consent = granted;
    },
    track(event: AnalyticsEvent): boolean {
      if (!consent || !adapter || !analyticsEventNames.includes(event.name))
        return false;
      if (conversionEvents.includes(event.name) && event.confirmed !== true)
        return false;
      // Copy only approved enum fields: no names, emails, phones, URLs or free text.
      const safeEvent: AnalyticsEvent = { name: event.name };
      if (event.placement && placements.includes(event.placement))
        safeEvent.placement = event.placement;
      if (event.confirmed === true) safeEvent.confirmed = true;
      try {
        adapter(Object.freeze(safeEvent));
        return true;
      } catch {
        return false;
      }
    },
  };
}

// No adapter, provider script or optional tracking is connected in Phase 2.
export const analytics = createAnalytics();
