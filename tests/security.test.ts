import test from 'node:test';
import assert from 'node:assert/strict';
import { submitLead } from '../src/lib/submit-lead.ts';
import {
  assertSafeBuildPath,
  assertSafeBuildText,
  assertPageCsp,
} from '../scripts/build-security.ts';

const lead = {
  name: 'Controlled test',
  company: 'Test fixture',
  workEmail: 'test@example.invalid',
  industry: 'technology-software',
  growthChallenge: 'qualified-leads',
  acquisitionMethods: ['referrals'],
  objective: 'Controlled unit test only',
  landingPath: '/',
};
const acceptance = {
  accepted: true,
  leadStored: true,
  notificationSent: true,
  reference: 'fixture',
};

test('lead transport rejects malformed, oversized and unsafe payloads before making a request', async () => {
  let calls = 0;
  for (const value of [
    null,
    [],
    {},
    { ...lead, name: 'a'.repeat(121) },
    { ...lead, name: 'Name\nBcc: injected' },
    { ...lead, company: 1 },
    { ...lead, workEmail: 'bad@example.invalid\r\nInjected' },
    { ...lead, website: 'javascript:alert(1)' },
    { ...lead, website: 'https://user:password@example.invalid' },
    { ...lead, industry: 'unknown' },
    { ...lead, budgetBand: 'invalid' },
    { ...lead, acquisitionMethods: ['referrals', 'referrals'] },
    { ...lead, acquisitionMethods: Array(8).fill('search') },
    { ...lead, objective: 'a'.repeat(2001) },
    { ...lead, objective: 'Private\u0000text' },
    { ...lead, landingPath: '//attacker.invalid/' },
    { ...lead, landingPath: '/\\attacker.invalid/' },
    { ...lead, landingPath: '/?email=private@example.invalid' },
  ]) {
    assert.equal(
      (
        await submitLead(value, async () => {
          calls++;
          return acceptance;
        })
      ).status,
      'invalid',
    );
  }
  assert.equal(calls, 0);
});

test('lead transport receives a normalized allowlist and requires all acceptance signals', async () => {
  assert.equal(
    (
      await submitLead(
        {
          ...lead,
          name: '  Controlled test  ',
          workEmail: '  test@example.invalid  ',
          privateNote: 'Do not forward',
        },
        async (payload) => {
          assert.deepEqual(payload, lead);
          return acceptance;
        },
      )
    ).status,
    'accepted',
  );
  for (const response of [
    null,
    { accepted: true },
    { ...acceptance, leadStored: false },
    { ...acceptance, notificationSent: undefined },
    { ...acceptance, notificationSent: false },
    { ...acceptance, reference: '' },
    { ...acceptance, reference: 'a'.repeat(129) },
  ])
    assert.equal(
      (await submitLead(lead, async () => response)).status,
      'error',
    );
  const failure = await submitLead(lead, async () => {
    throw new Error('Private server path and token');
  });
  assert.equal(failure.status, 'error');
  assert.ok(!JSON.stringify(failure).includes('Private server'));
});

test('lead cancellation cannot call transport or report success after interruption', async () => {
  const before = new AbortController();
  before.abort();
  let calls = 0;
  assert.equal(
    (
      await submitLead(
        lead,
        async () => {
          calls++;
          return acceptance;
        },
        before.signal,
      )
    ).status,
    'error',
  );
  assert.equal(calls, 0);
  const during = new AbortController();
  assert.equal(
    (
      await submitLead(
        lead,
        async () => {
          during.abort();
          return acceptance;
        },
        during.signal,
      )
    ).status,
    'error',
  );
});

test('release guard rejects dotfiles, source, credentials, backups, archives and source maps', () => {
  for (const path of [
    '.env',
    '.env.production',
    '.git/config',
    '.github/workflows/build.yml',
    'src/data/site.ts',
    'docs/internal.txt',
    'server/index.js',
    'node_modules/pkg/index.js',
    'output/report.pdf',
    'tmp/debug.txt',
    'index.html.bak',
    'bundle.js.map',
    'backup.zip',
    'private.pem',
    'key.p12',
    'leads.sqlite',
    'package-lock.json',
    'service-account.json',
    'credentials.json',
    'api/lead.php',
    'api/lead.phtml',
    '../outside.txt',
    'nested/.htaccess',
  ])
    assert.throws(() => assertSafeBuildPath(path), path);
  for (const path of [
    '.htaccess',
    '.well-known/security.txt',
    '_astro/page.js',
    'services/index.html',
    'fonts/ibm-plex-sans-variable.woff2',
    'fonts/ibm-plex-OFL.txt',
  ])
    assert.doesNotThrow(() => assertSafeBuildPath(path), path);
});

test('release guard redacts credential evidence and requires an early restrictive CSP', () => {
  for (const value of [
    '-----BEGIN PRIVATE KEY-----',
    '"private_key": "fixture"',
    'postgresql://user:password@example.invalid/db',
    'fixture@project.iam.gserviceaccount.com',
  ])
    assert.throws(() => assertSafeBuildText(value, 'fixture.txt'), {
      message:
        'Potential credential or private integration identifier in static output: fixture.txt',
    });
  assert.doesNotThrow(() =>
    assertSafeBuildText('Public marketing copy', 'index.html'),
  );
  const policy =
    "default-src 'self'; base-uri 'none'; object-src 'none'; connect-src 'none'; form-action https://formspree.io; frame-src 'none'; script-src-attr 'none'; script-src 'self'";
  const meta = `<meta http-equiv="content-security-policy" content="${policy}">`;
  assert.doesNotThrow(() =>
    assertPageCsp(`${meta}<script src="/app.js"></script>`, 'fixture'),
  );
  assert.throws(() => assertPageCsp('<h1>No policy</h1>', 'fixture'));
  assert.throws(() =>
    assertPageCsp(
      meta.replace('form-action https://formspree.io', 'form-action *'),
      'fixture',
    ),
  );
  assert.throws(() =>
    assertPageCsp(
      meta.replace(
        'form-action https://formspree.io',
        'form-action https://attacker.invalid',
      ),
      'fixture',
    ),
  );
  assert.throws(() =>
    assertPageCsp(`<script src="/app.js"></script>${meta}`, 'fixture'),
  );
  assert.throws(() =>
    assertPageCsp(`${meta}<a href="javascript:alert(1)">Bad</a>`, 'fixture'),
  );
  assert.throws(() =>
    assertPageCsp(
      `${meta}<img src="/image.png" onerror="alert(1)">`,
      'fixture',
    ),
  );
});
