import { getCollection } from 'astro:content';

export async function getPublishedInsights() {
  const entries = await getCollection('insights', ({ data }) => !data.draft);
  assertUniqueSlugs(entries);
  return entries.sort((a, b) =>
    b.data.publishedAt.localeCompare(a.data.publishedAt),
  );
}

export async function getPublishedCaseStudies() {
  const entries = await getCollection(
    'case-studies',
    ({ data }) => !data.draft && data.approvedForPublication,
  );
  assertUniqueSlugs(entries);
  return entries;
}

function assertUniqueSlugs(
  entries: readonly { data: { slug: string } }[],
): void {
  const seen = new Set<string>();
  for (const { data } of entries) {
    if (seen.has(data.slug))
      throw new Error(`Duplicate published content slug: ${data.slug}`);
    seen.add(data.slug);
  }
}
