import { z } from 'astro/zod';
import type { ConsultationLead } from '../types/forms.ts';

const singleLine = (maximum: number) =>
  z
    .string()
    .trim()
    .min(1)
    .max(maximum)
    .regex(/^[^\u0000-\u001f\u007f]*$/);

// This validates a transport payload, not HTML/SQL/Sheet output. Each endpoint
// must validate again and encode values for its actual destination (e.g. RAW Sheets writes).
const consultationLeadSchema = z.object({
  name: singleLine(120),
  company: singleLine(160),
  workEmail: singleLine(254).pipe(z.email()),
  website: singleLine(2048)
    .refine((value) => {
      try {
        const url = new URL(value);
        return (
          (url.protocol === 'https:' || url.protocol === 'http:') &&
          !url.username &&
          !url.password
        );
      } catch {
        return false;
      }
    })
    .optional(),
  phone: singleLine(40).optional(),
  industry: z.enum([
    'technology-software',
    'education',
    'healthcare',
    'real-estate',
    'ecommerce',
    'other',
  ]),
  employeeCount: z
    .enum(['1-4', '5-10', '11-50', '51-200', '201-plus'])
    .optional(),
  location: singleLine(160).optional(),
  growthChallenge: z.enum([
    'qualified-leads',
    'sales',
    'search-visibility',
    'paid-acquisition',
    'outbound-prospecting',
    'sales-support',
    'crm-automation',
    'other',
  ]),
  acquisitionMethods: z
    .array(
      z.enum([
        'referrals',
        'search',
        'paid-ads',
        'outbound',
        'social-media',
        'partnerships',
        'other',
      ]),
    )
    .max(7)
    .refine((values) => new Set(values).size === values.length),
  budgetBand: z
    .enum([
      'under-50000',
      '50000-100000',
      '100000-250000',
      '250000-500000',
      '500000-plus',
      'unsure',
    ])
    .optional(),
  objective: z
    .string()
    .trim()
    .min(1)
    .max(2000)
    .regex(/^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]*$/),
  // Do not carry enquiry text, attribution query strings or fragments into storage.
  landingPath: singleLine(1024).regex(/^\/(?!\/)[^\\?#\s]*$/),
});

export function validateConsultationLead(
  value: unknown,
): ConsultationLead | undefined {
  const result = consultationLeadSchema.safeParse(value);
  return result.success ? result.data : undefined;
}
