import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a lowercase kebab-case slug.');
const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00Z`);
    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, 'Use a real ISO calendar date.');
const httpsURL = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
}, 'Use a public HTTPS URL without credentials.');
const image = z.object({
  src: text,
  alt: text,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const insightSchema = z
  .object({
    title: text,
    description: text,
    slug,
    author: z.object({ name: text, profileURL: httpsURL.optional() }),
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    category: z.enum([
      'B2B Growth',
      'Technology Marketing',
      'Education Marketing',
      'SEO & AI Search',
      'Sales Development',
    ]),
    tags: z.array(text).default([]),
    featuredImage: image.optional(),
    canonicalURL: httpsURL.optional(),
    draft: z.boolean().default(true),
  })
  .refine((entry) => !entry.updatedAt || entry.updatedAt >= entry.publishedAt, {
    message: 'Update date cannot precede publication.',
    path: ['updatedAt'],
  });

export const caseStudySchema = z
  .object({
    title: text,
    description: text,
    slug,
    industry: text,
    client: z.object({ name: text, permissionToName: z.boolean() }).optional(),
    situation: text.optional(),
    problem: text.optional(),
    diagnosis: text.optional(),
    strategy: z.array(text).optional(),
    execution: z.array(text).optional(),
    services: z.array(text).default([]),
    timeframe: text.optional(),
    evidence: z
      .array(z.object({ description: text, sourceURL: httpsURL.optional() }))
      .default([]),
    metrics: z
      .array(
        z.object({
          name: text,
          value: z.number(),
          baseline: z.number().optional(),
          unit: text,
          definition: text,
          timeframe: text,
          limitations: text.optional(),
        }),
      )
      .default([]),
    testimonial: z
      .object({
        quote: text,
        attribution: text,
        permissionToPublish: z.boolean(),
      })
      .optional(),
    screenshots: z.array(image).default([]),
    lessons: z.array(text).optional(),
    limitations: text.optional(),
    approvedForPublication: z.boolean().default(false),
    canonicalURL: httpsURL.optional(),
    draft: z.boolean().default(true),
  })
  .superRefine((entry, context) => {
    if (entry.draft) return;
    if (!entry.approvedForPublication || entry.evidence.length === 0) {
      context.addIssue({
        code: 'custom',
        message: 'Published case studies need owner approval and evidence.',
      });
    }
    if (entry.client && !entry.client.permissionToName) {
      context.addIssue({
        code: 'custom',
        message: 'Remove client identity or obtain permission to name them.',
        path: ['client'],
      });
    }
    if (entry.testimonial && !entry.testimonial.permissionToPublish) {
      context.addIssue({
        code: 'custom',
        message: 'Remove the testimonial or obtain publication permission.',
        path: ['testimonial'],
      });
    }
  });
