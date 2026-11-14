import test from 'node:test';
import assert from 'node:assert/strict';
import {
  csvCell,
  parseSnapshot,
  parseWorkspace,
  percentageChange,
  resolvePortalConfig,
} from '../src/lib/portal/model.ts';
import { sampleSnapshot } from '../src/data/portal-demo.ts';
import { assertPageCsp } from '../scripts/build-security.ts';

test('portal accepts only a single HTTPS Supabase project and browser publishable key', () => {
  const key = 'sb_publishable_controlled_fixture_0123456789';
  assert.equal(resolvePortalConfig(undefined, undefined), null);
  assert.equal(
    resolvePortalConfig('https://controlled-fixture.supabase.co', key)?.url,
    'https://controlled-fixture.supabase.co',
  );
  for (const url of [
    'http://controlled-fixture.supabase.co',
    'https://attacker.invalid',
    'https://user:pass@controlled-fixture.supabase.co',
    'https://controlled-fixture.supabase.co/path',
    'https://controlled-fixture.supabase.co?secret=value',
  ])
    assert.throws(() => resolvePortalConfig(url, key));
  for (const key of [
    'sb_secret_controlled_fixture_0123456789',
    'eyJcontrolled.jwt.fixture',
    '',
    undefined,
  ])
    assert.throws(() =>
      resolvePortalConfig('https://controlled-fixture.supabase.co', key),
    );
});
test('report parser bounds external data, complete periods, dates, measures and chart colors', () => {
  for (const days of [7, 28, 90])
    assert.equal(parseSnapshot(sampleSnapshot(days)).daily.length, days);
  const source = sampleSnapshot(28);
  for (const invalid of [
    null,
    {},
    { ...source, periodDays: 30 },
    { ...source, daily: source.daily.slice(1) },
    { ...source, periodStart: '2026-02-30' },
    {
      ...source,
      periodEnd: '2026-11-09',
      daily: [
        ...source.daily.slice(0, -1),
        { ...source.daily.at(-1), date: '2026-11-09' },
      ],
    },
    {
      ...source,
      channels: [
        { name: 'Invalid', color: 'url(https://attacker.invalid)', visits: 10 },
      ],
    },
    {
      ...source,
      metrics: [
        {
          key: 'visits',
          label: 'Visits',
          value: Infinity,
          previous: 0,
          unit: 'number',
        },
      ],
    },
  ])
    assert.throws(() => parseSnapshot(invalid));
  assert.throws(() =>
    parseWorkspace({
      id: 'fixture',
      name: 'Fixture',
      website: 'javascript:alert(1)',
    }),
  );
  assert.equal(percentageChange(5, 0), null);
  assert.equal(percentageChange(120, 100), 20);
});
test('CSV exports neutralize spreadsheet formulas and quote embedded separators', () => {
  assert.equal(
    csvCell('=HYPERLINK("https://example.invalid")'),
    '"\'=HYPERLINK(""https://example.invalid"")"',
  );
  assert.equal(csvCell('  +CMD'), '"\'  +CMD"');
  assert.equal(csvCell('Business, "One"'), '"Business, ""One"""');
});
test('portal CSP is scoped to its project and does not relax marketing-page policy', () => {
  const directives =
    "default-src 'self'; base-uri 'none'; object-src 'none'; connect-src https://controlled-fixture.supabase.co; form-action 'self'; frame-src 'none'; script-src-attr 'none'; script-src 'self'";
  const html = `<meta name="portal-auth-origin" content="https://controlled-fixture.supabase.co"><meta http-equiv="content-security-policy" content="${directives}">`;
  assert.doesNotThrow(() => assertPageCsp(html, 'portal fixture', true));
  assert.throws(() => assertPageCsp(html, 'marketing fixture'));
  assert.throws(() =>
    assertPageCsp(
      html.replaceAll('controlled-fixture.supabase.co', 'attacker.invalid'),
      'portal fixture',
      true,
    ),
  );
});
