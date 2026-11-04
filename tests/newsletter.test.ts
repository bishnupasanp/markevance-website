import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isNewsletterAcceptance,
  submitNewsletter,
  validateNewsletterSubscription,
} from '../src/lib/submit-newsletter.ts';
import type { NewsletterSubscription } from '../src/types/newsletter.ts';

const subscription: NewsletterSubscription = {
  workEmail: 'test@example.invalid',
  consent: true,
  placement: 'inline',
};
const accepted = {
  accepted: true,
  subscriptionStored: true,
  status: 'subscribed',
  reference: 'controlled-fixture',
};

test('newsletter remains unavailable without an explicitly supplied transport', async () => {
  assert.equal((await submitNewsletter(subscription)).status, 'unavailable');
  assert.equal((await submitNewsletter(null)).status, 'unavailable');
});

test('newsletter validates bounded email/name, placement and explicit consent before transport', async () => {
  let calls = 0;
  for (const invalid of [
    null,
    { ...subscription, workEmail: 'invalid' },
    { ...subscription, workEmail: 'a'.repeat(250) + '@example.invalid' },
    { ...subscription, workEmail: 'bad\u0000@example.invalid' },
    { ...subscription, firstName: 'a'.repeat(81) },
    { ...subscription, firstName: 'Name\nInjected' },
    { ...subscription, firstName: 12 },
    { ...subscription, consent: false },
    { ...subscription, consent: 'true' },
    { ...subscription, placement: 'unknown' },
  ]) {
    const result = await submitNewsletter(invalid, async () => {
      calls += 1;
      return accepted;
    });
    assert.equal(result.status, 'invalid');
  }
  assert.equal(calls, 0);
});

test('newsletter transport receives normalized whitelisted fields only', async () => {
  const result = await submitNewsletter(
    {
      ...subscription,
      workEmail: '  test@example.invalid  ',
      firstName: '  Controlled  ',
      privateNote: 'Not forwarded',
    },
    async (payload) => {
      assert.deepEqual(payload, { ...subscription, firstName: 'Controlled' });
      return accepted;
    },
  );
  assert.deepEqual(result, {
    status: 'subscribed',
    reference: 'controlled-fixture',
  });
  const normalized = validateNewsletterSubscription({
    ...subscription,
    firstName: '  ',
  });
  assert.deepEqual(normalized, { valid: true, subscription });
});

test('newsletter never treats incomplete or malformed provider responses as success', async () => {
  for (const response of [
    null,
    { accepted: true },
    { ...accepted, subscriptionStored: false },
    { ...accepted, reference: '' },
    { ...accepted, reference: 'x'.repeat(129) },
    { ...accepted, status: 'unknown' },
    { ...accepted, status: 'confirmation-required' },
    { ...accepted, status: 'confirmation-required', confirmationSent: false },
  ]) {
    assert.equal(isNewsletterAcceptance(response), false);
    assert.equal(
      (await submitNewsletter(subscription, async () => response)).status,
      'error',
    );
  }
});

test('double opt-in remains confirmation-required until the endpoint confirms a subscription', async () => {
  const response = {
    ...accepted,
    status: 'confirmation-required',
    confirmationSent: true,
  };
  assert.equal(isNewsletterAcceptance(response), true);
  assert.deepEqual(await submitNewsletter(subscription, async () => response), {
    status: 'confirmation-required',
    reference: 'controlled-fixture',
  });
});

test('newsletter provider failure is retryable and cannot become success', async () => {
  assert.equal(
    (
      await submitNewsletter(subscription, async () => {
        throw new Error('Controlled fixture');
      })
    ).status,
    'error',
  );
  assert.equal(
    (await submitNewsletter(subscription, async () => accepted)).status,
    'subscribed',
  );
});

test('newsletter cancellation avoids transport or success on an interrupted request', async () => {
  const request = new AbortController();
  request.abort();
  let calls = 0;
  const result = await submitNewsletter(
    subscription,
    async () => {
      calls += 1;
      return accepted;
    },
    request.signal,
  );
  assert.equal(result.status, 'error');
  assert.equal(calls, 0);
  const interrupted = new AbortController();
  assert.equal(
    (
      await submitNewsletter(
        subscription,
        async () => {
          interrupted.abort();
          return accepted;
        },
        interrupted.signal,
      )
    ).status,
    'error',
  );
});
