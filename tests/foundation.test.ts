import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canonicalURL, resolveMetadata } from '../src/lib/seo.ts';
import {
  serializeJsonLd,
  organizationSchema,
} from '../src/lib/structured-data.ts';
import { isIndexableURL, hasIndexablePages } from '../src/lib/sitemap.ts';
import { createAnalytics } from '../src/lib/analytics.ts';
import { isLeadAcceptance, submitLead } from '../src/lib/submit-lead.ts';
import { insightSchema, caseStudySchema } from '../src/lib/content-schemas.ts';
import { routes } from '../src/data/routes.ts';
import { mainNavigation, footerNavigation } from '../src/data/navigation.ts';
import type { AnalyticsEvent } from '../src/types/analytics.ts';
import type { ConsultationLead } from '../src/types/forms.ts';

test('canonical normalization uses one origin and trailing-slash policy', () => {
  assert.equal(
    canonicalURL('/services?campaign=test#heading'),
    'https://markevance.com/services/',
  );
  assert.equal(canonicalURL('/'), 'https://markevance.com/');
  assert.throws(() => canonicalURL('//other.example/'));
  assert.throws(() => canonicalURL('/\\other.example/'));
  assert.throws(() =>
    resolveMetadata({
      title: 'Test',
      description: 'Test',
      path: '/',
      canonicalURL: 'javascript:alert(1)',
    }),
  );
  assert.equal(
    resolveMetadata({ title: 'Test', description: 'Test', path: '/' }).noindex,
    true,
  );
});

test('social metadata defaults to the square brand image and preserves page-specific artwork', () => {
  const base = {
    title: 'Controlled fixture',
    description: 'Test',
    path: '/' as const,
  };
  const defaults = resolveMetadata(base);
  assert.equal(
    defaults.image,
    'https://markevance.com/brand/markevance-social-profile-1080x1080.png',
  );
  assert.equal(defaults.imageWidth, 1080);
  assert.equal(defaults.imageHeight, 1080);
  assert.equal(defaults.twitterCard, 'summary');
  assert.match(defaults.imageAlt ?? '', /Markevance/);

  const custom = resolveMetadata({
    ...base,
    ogImage: '/images/approved-case-study.png',
    ogImageAlt: 'Approved case study',
  });
  assert.equal(
    custom.image,
    'https://markevance.com/images/approved-case-study.png',
  );
  assert.equal(custom.imageAlt, 'Approved case study');
  assert.equal(custom.imageWidth, undefined);
  assert.equal(custom.twitterCard, 'summary_large_image');
  assert.equal(
    resolveMetadata({ ...base, ogImage: '/images/custom.png' }).imageAlt,
    undefined,
  );
});

test('JSON-LD cannot terminate its script element and omits unknown entity fields', () => {
  const serialized = serializeJsonLd({
    value: '</script><script>alert(1)</script>&',
  });
  assert.ok(!serialized.includes('<'));
  assert.deepEqual(JSON.parse(serialized), {
    value: '</script><script>alert(1)</script>&',
  });
  const organization = JSON.stringify(organizationSchema());
  assert.ok(!organization.includes('address'));
  assert.ok(!organization.includes('telephone'));
});

test('only ready canonical routes enter the sitemap; unavailable and review pages stay excluded', () => {
  assert.equal(hasIndexablePages, true);
  for (const route of routes)
    assert.equal(isIndexableURL(canonicalURL(route.path)), route.indexable);
  for (const path of [
    '/book-consultation/',
    '/contact/',
    '/insights/',
    '/case-studies/',
    '/privacy-policy/',
    '/terms/',
    '/cookie-policy/',
    '/thank-you/',
  ])
    assert.equal(isIndexableURL(canonicalURL(path)), false, path);
  for (const path of [
    '/',
    '/services/b2b-lead-generation/',
    '/industries/education/',
    '/how-we-work/',
    '/about/',
  ])
    assert.equal(isIndexableURL(canonicalURL(path)), true, path);
  assert.equal(isIndexableURL('https://markevance.com/?campaign=test'), false);
  assert.equal(isIndexableURL('https://markevance.com/#growth-system'), false);
  assert.equal(
    isIndexableURL(
      'https://markevance.com/insights/the-mechanics-of-b2b-lead-generation-in-nepal/',
    ),
    false,
  );
  assert.equal(
    isIndexableURL(
      'https://markevance.com/case-studies/regional-software-provider-growth/',
    ),
    false,
  );
  assert.equal(isIndexableURL('https://markevance.com/404/'), false);
  assert.equal(isIndexableURL('https://other.example/'), false);
});

test('navigation targets exist and no secondary expansion or duplicate solution routes exist', () => {
  const paths = new Set(routes.map((route) => route.path));
  assert.equal(paths.size, routes.length);
  const links = [
    ...mainNavigation.flatMap((item) => [item, ...(item.children ?? [])]),
    ...footerNavigation.flatMap((group) => group.items),
  ];
  for (const link of links) assert.ok(paths.has(link.href), link.href);
  for (const route of routes) assert.match(route.path, /^\/(?:[a-z0-9-]+\/)*$/);
  assert.ok(!paths.has('/solutions/b2b-lead-generation/'));
  assert.ok(!paths.has('/industries/healthcare/'));
});

const lead: ConsultationLead = {
  name: 'Controlled test',
  company: 'Test fixture',
  workEmail: 'test@example.invalid',
  industry: 'technology-software',
  growthChallenge: 'qualified-leads',
  acquisitionMethods: ['referrals'],
  objective: 'Controlled unit test only',
  landingPath: '/',
};

test('lead boundary requires both stored acceptance and notification', async () => {
  assert.equal((await submitLead(lead)).status, 'unavailable');
  assert.equal(
    (
      await submitLead(lead, async () => ({
        accepted: true,
        leadStored: true,
        notificationSent: false,
        reference: 'test',
      }))
    ).status,
    'error',
  );
  assert.equal(
    (
      await submitLead(lead, async () => {
        throw new Error('Controlled failure');
      })
    ).status,
    'error',
  );
  assert.equal(isLeadAcceptance({ accepted: true, reference: 'test' }), false);
  assert.deepEqual(
    await submitLead(lead, async () => ({
      accepted: true,
      leadStored: true,
      notificationSent: true,
      reference: 'test',
    })),
    { status: 'accepted', reference: 'test' },
  );
});

test('analytics requires consent and confirmed outcomes and drops extra personal fields', () => {
  const sent: AnalyticsEvent[] = [];
  const analytics = createAnalytics((event) => sent.push(event));
  assert.equal(analytics.track({ name: 'consultation_cta_clicked' }), false);
  analytics.setConsent(true);
  assert.equal(analytics.track({ name: 'consultation_booked' }), false);
  const eventWithPersonalData = {
    name: 'consultation_cta_clicked' as const,
    placement: 'header' as const,
    email: 'test@example.invalid',
    text: 'Private enquiry',
  };
  assert.equal(analytics.track(eventWithPersonalData), true);
  assert.deepEqual(sent[0], {
    name: 'consultation_cta_clicked',
    placement: 'header',
  });
  assert.equal(
    analytics.track({ name: 'consultation_booked', confirmed: true }),
    true,
  );
  analytics.setConsent(false);
  assert.equal(analytics.track({ name: 'consultation_cta_clicked' }), false);
});

test('insights require authorship, real dates, safe slugs and default to drafts', () => {
  const fixture = {
    title: 'Controlled schema fixture',
    description: 'Not published',
    slug: 'controlled-fixture',
    author: { name: 'Test fixture' },
    publishedAt: '2026-10-03',
    category: 'B2B Growth',
  };
  assert.equal(insightSchema.parse(fixture).draft, true);
  assert.equal(
    insightSchema.safeParse({ ...fixture, author: undefined }).success,
    false,
  );
  assert.equal(
    insightSchema.safeParse({ ...fixture, publishedAt: '2026-02-30' }).success,
    false,
  );
  assert.equal(
    insightSchema.safeParse({ ...fixture, updatedAt: '2026-10-02' }).success,
    false,
  );
  assert.equal(
    insightSchema.safeParse({ ...fixture, slug: '../bad' }).success,
    false,
  );
});

test('publishing a case study requires evidence, approval and identity/testimonial permission', () => {
  const fixture = {
    title: 'Controlled schema fixture',
    description: 'Not published',
    slug: 'controlled-fixture',
    industry: 'Test fixture',
  };
  assert.equal(caseStudySchema.parse(fixture).draft, true);
  assert.equal(
    caseStudySchema.safeParse({ ...fixture, draft: false }).success,
    false,
  );
  const approved = {
    ...fixture,
    draft: false,
    approvedForPublication: true,
    evidence: [{ description: 'Controlled fixture only' }],
  };
  assert.equal(caseStudySchema.safeParse(approved).success, true);
  assert.equal(
    caseStudySchema.safeParse({
      ...approved,
      client: { name: 'Test', permissionToName: false },
    }).success,
    false,
  );
  assert.equal(
    caseStudySchema.safeParse({
      ...approved,
      testimonial: {
        quote: 'Test',
        attribution: 'Fixture',
        permissionToPublish: false,
      },
    }).success,
    false,
  );
});

test('semantic brand tokens meet contrast thresholds in their actual surface pairings', () => {
  const css = readFileSync(
    new URL('../src/styles/tokens.css', import.meta.url),
    'utf8',
  );
  function color(name: string): string {
    const value = css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1];
    assert.ok(value, `Missing token: ${name}`);
    const alias = value.match(/^var\(--color-([\w-]+)\)$/)?.[1];
    if (alias) return color(alias);
    assert.match(value, /^#[a-f0-9]{6}$/i);
    return value;
  }
  function luminance(hex: string): number {
    const channels = hex
      .match(/[a-f0-9]{2}/gi)
      ?.map((channel) => parseInt(channel, 16) / 255);
    assert.ok(channels && channels.length === 3);
    const values = channels.map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
    return 0.2126 * values[0]! + 0.7152 * values[1]! + 0.0722 * values[2]!;
  }
  const pairings: [string, string, number][] = [
    ['text-dark', 'background-light', 4.5],
    ['text-secondary', 'background-light', 4.5],
    ['text-muted', 'background-light', 4.5],
    ['link', 'background-light', 4.5],
    ['link-hover', 'background-light', 4.5],
    ['action-text', 'brand', 4.5],
    ['action-text', 'brand-hover', 4.5],
    ['focus', 'background-light', 3],
  ];
  for (const surface of ['background-dark', 'surface-dark']) {
    pairings.push(
      ['text-light', surface, 4.5],
      ['text-muted-dark', surface, 4.5],
      ['link-dark', surface, 4.5],
      ['accent-prestige', surface, 4.5],
      ['focus-dark', surface, 3],
      ['brand', surface, 3],
      ['link', surface, 3], // Native checkbox boundary, not small link text.
    );
  }
  for (const [foreground, background, minimum] of pairings) {
    const values = [luminance(color(foreground)), luminance(color(background))];
    const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
    assert.ok(
      ratio >= minimum,
      `${foreground}/${background}: ${ratio.toFixed(2)} < ${minimum}`,
    );
  }
});
