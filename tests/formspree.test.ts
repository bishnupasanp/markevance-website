import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createFormspreeTransport,
  consultationEndpoint,
  formspreeFields,
  isConsultationHost,
  resolveFormspreeEndpoint,
} from '../src/lib/formspree.ts';
import { submitLead } from '../src/lib/submit-lead.ts';
import type { ConsultationLead } from '../src/types/forms.ts';

const lead: ConsultationLead = {
  name: 'Controlled fixture',
  company: 'Example',
  workEmail: 'fixture@example.invalid',
  industry: 'technology-software',
  growthChallenge: 'qualified-leads',
  acquisitionMethods: [],
  objective: 'Controlled unit test only',
  landingPath: '/book-consultation/',
};

test('Formspree configuration accepts public endpoints and rejects executable or ambiguous addresses', () => {
  assert.equal(
    resolveFormspreeEndpoint(consultationEndpoint),
    consultationEndpoint,
  );
  for (const endpoint of [
    undefined,
    '',
    'javascript:alert(1)',
    'http://formspree.io/f/mvkzleqv',
    'https://formspree.io.attacker.invalid/f/mvkzleqv',
    'https://user@formspree.io/f/mvkzleqv',
    'https://formspree.io/f/mvkzleqv?email=private',
    'https://formspree.io/f/mvkzleqv#fragment',
    'https://formspree.io/f/../test',
    'https://formspree.io/f/REPLACE_WITH_FORM_ID',
  ]) {
    assert.equal(resolveFormspreeEndpoint(endpoint), undefined);
    assert.equal(
      createFormspreeTransport(endpoint, () => assert.fail()),
      undefined,
    );
  }
  assert.equal(isConsultationHost('markevance.com'), true);
  assert.equal(isConsultationHost('www.markevance.com'), true);
  for (const host of [
    'localhost',
    '127.0.0.1',
    'notmarkevance.com',
    'markevance.com.attacker.invalid',
  ])
    assert.equal(isConsultationHost(host), false);
});

test('hosted CAPTCHA handoff is not acceptance, a fabricated receipt or notification proof', async () => {
  let navigations = 0;
  const transport = createFormspreeTransport(
    consultationEndpoint,
    (request) => {
      navigations++;
      assert.equal(request.action, consultationEndpoint);
      assert.deepEqual(request.fields, formspreeFields(lead));
      assert.ok(!('notificationSent' in request.fields));
      assert.ok(!('reference' in request.fields));
    },
  );
  assert.deepEqual(
    await submitLead({ ...lead, privateNote: 'Not forwarded' }, transport),
    { status: 'handoff' },
  );
  assert.equal(navigations, 1);
});

test('native adapter forwards normalized allowlisted fields, including the email reply-to field', async () => {
  const transport = createFormspreeTransport(
    consultationEndpoint,
    ({ fields }) => {
      assert.equal(fields.name, lead.name);
      assert.equal(fields.email, lead.workEmail);
      assert.equal(fields.acquisition, 'referrals, search');
      assert.equal(fields.employeeCount, '11-50');
      assert.equal(fields.phone, '+977 1234567890');
      assert.equal(fields.sourcePath, '/book-consultation/');
      assert.ok(!('privateNote' in fields));
      assert.ok(!('workEmail' in fields));
    },
  );
  assert.equal(
    (
      await submitLead(
        {
          ...lead,
          name: `  ${lead.name}  `,
          acquisitionMethods: ['referrals', 'search'],
          phone: '+977 1234567890',
          employeeCount: '11-50',
          privateNote: 'Not forwarded',
        },
        transport,
      )
    ).status,
    'handoff',
  );
});

test('invalid input, cancellation and native navigation failure cannot report a handoff', async () => {
  let navigations = 0;
  const transport = createFormspreeTransport(consultationEndpoint, () => {
    navigations++;
  });
  assert.equal(
    (await submitLead({ ...lead, workEmail: 'invalid' }, transport)).status,
    'invalid',
  );
  const controller = new AbortController();
  controller.abort();
  assert.equal(
    (await submitLead(lead, transport, controller.signal)).status,
    'error',
  );
  assert.equal(navigations, 0);
  const failure = createFormspreeTransport(consultationEndpoint, () => {
    throw new Error('Private details must not leak');
  });
  const result = await submitLead(lead, failure);
  assert.equal(result.status, 'error');
  assert.ok(!JSON.stringify(result).includes('Private details'));
});
