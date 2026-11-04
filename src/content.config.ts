import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { caseStudySchema, insightSchema } from './lib/content-schemas.ts';

const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: insightSchema,
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/case-studies' }),
  schema: caseStudySchema,
});

export const collections = { insights, 'case-studies': caseStudies };
