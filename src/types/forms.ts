export type Industry =
  | 'technology-software'
  | 'education'
  | 'healthcare'
  | 'real-estate'
  | 'ecommerce'
  | 'other';
export type EmployeeCount = '1-4' | '5-10' | '11-50' | '51-200' | '201-plus';
export type GrowthChallenge =
  | 'qualified-leads'
  | 'sales'
  | 'search-visibility'
  | 'paid-acquisition'
  | 'outbound-prospecting'
  | 'sales-support'
  | 'crm-automation'
  | 'other';
export type AcquisitionMethod =
  | 'referrals'
  | 'search'
  | 'paid-ads'
  | 'outbound'
  | 'social-media'
  | 'partnerships'
  | 'other';
// Qualification bands are not agency prices and are not displayed in Phase 2.
export type BudgetBand =
  | 'under-50000'
  | '50000-100000'
  | '100000-250000'
  | '250000-500000'
  | '500000-plus'
  | 'unsure';

export interface ConsultationLead {
  name: string;
  company: string;
  workEmail: string;
  website?: string;
  phone?: string;
  industry: Industry;
  employeeCount?: EmployeeCount;
  location?: string;
  growthChallenge: GrowthChallenge;
  acquisitionMethods: readonly AcquisitionMethod[];
  budgetBand?: BudgetBand;
  objective: string;
  landingPath: string;
}

export type LeadSubmissionResult =
  | { status: 'accepted'; reference: string }
  | { status: 'handoff' }
  | { status: 'unavailable' | 'invalid' | 'error'; message: string };

// Both the private lead record and the required notification must be confirmed.
export interface LeadAcceptance {
  accepted: true;
  reference: string;
  leadStored: true;
  notificationSent: true;
}

export type LeadSubmissionTransport = (
  lead: ConsultationLead,
  signal?: AbortSignal,
) => Promise<unknown>;

export type ConsultationFormState =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; reference: string }
  | { status: 'error'; message: string; retryable: boolean };
