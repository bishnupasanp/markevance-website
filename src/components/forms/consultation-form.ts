import { submitLead } from '../../lib/submit-lead.ts';
import {
  createFormspreeTransport,
  isConsultationHost,
} from '../../lib/formspree.ts';
import { analytics } from '../../lib/analytics.ts';

export function initConsultationForms(): void {
  document
    .querySelectorAll<HTMLFormElement>('[data-consultation-form]')
    .forEach((form) => {
      if (form.dataset.initialized) return;
      form.dataset.initialized = 'true';
      const button = form.querySelector<HTMLButtonElement>('[type="submit"]');
      const status = form.querySelector<HTMLElement>('[data-form-status]');
      if (!button || !status) return;
      const originalLabel = button.textContent ?? 'Send consultation request';
      const controls = form.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >('input:not([type="hidden"]), select, textarea');
      const errors = form.querySelector<HTMLElement>('[data-form-errors]');
      let pending = false;
      let started = false;
      const showStatus = (message: string): void => {
        status.textContent = message;
        status.hidden = false;
      };
      const resetPending = (): void => {
        pending = false;
        button.disabled = false;
        button.textContent = originalLabel;
        form.removeAttribute('aria-busy');
        document
          .querySelectorAll('[data-formspree-handoff]')
          .forEach((node) => node.remove());
      };
      const transport = createFormspreeTransport(
        form.getAttribute('action'),
        ({ action, fields }) => {
          const nativeForm = document.createElement('form');
          nativeForm.method = 'POST';
          nativeForm.action = action;
          nativeForm.hidden = true;
          nativeForm.dataset.formspreeHandoff = 'true';
          Object.entries(fields).forEach(([name, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            nativeForm.append(input);
          });
          document.body.append(nativeForm);
          nativeForm.submit();
        },
      );
      if (!transport) return; // Keep the native path if enhancement cannot initialize.
      form.noValidate = true;
      form.addEventListener('focusin', () => {
        if (!started) {
          started = true;
          analytics.track({
            name: 'consultation_form_started',
            placement: 'form',
          });
        }
      });
      controls.forEach((control) => {
        control.addEventListener('input', () => {
          control.removeAttribute('aria-invalid');
          const error = document.getElementById(`${control.id}-error`);
          if (error) error.textContent = '';
          if (errors) errors.hidden = true;
        });
      });
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (pending) return;
        let firstInvalid: HTMLElement | undefined;
        controls.forEach((control) => {
          // Native required treats spaces as content. Validate trimmed text too.
          const valid =
            control.validity.valid &&
            (!control.required || control.value.trim().length > 0);
          control.toggleAttribute('aria-invalid', !valid);
          if (!valid) control.setAttribute('aria-invalid', 'true');
          const error = document.getElementById(`${control.id}-error`);
          if (error)
            error.textContent = valid
              ? ''
              : control.validity.valueMissing || !control.value.trim()
                ? 'Please complete this field.'
                : control.validity.typeMismatch
                  ? 'Please enter a valid email or website address.'
                  : 'Please check this field and its length.';
          if (!valid && !firstInvalid) firstInvalid = control;
        });
        if (firstInvalid) {
          if (errors) errors.hidden = false;
          const details = firstInvalid.closest('details');
          if (details) details.open = true;
          firstInvalid.focus();
          return;
        }
        if (!isConsultationHost(window.location.hostname)) {
          showStatus(
            'This preview does not send requests. Online requests can only be sent from markevance.com. You can also contact us by email or WhatsApp.',
          );
          return;
        }
        const data = new FormData(form);
        const text = (name: string): string =>
          String(data.get(name) ?? '').trim();
        const optional = (name: string): string | undefined =>
          text(name) || undefined;
        pending = true;
        button.disabled = true;
        button.textContent = 'Continuing to verification…';
        form.setAttribute('aria-busy', 'true');
        showStatus(
          'Continuing to Formspree for verification. Your request is not confirmed yet.',
        );
        const result = await submitLead(
          {
            name: text('name'),
            workEmail: text('email'),
            company: text('company'),
            industry: text('industry'),
            website: optional('website'),
            phone: optional('phone'),
            employeeCount: optional('employeeCount'),
            growthChallenge: text('challenge'),
            acquisitionMethods: text('acquisition')
              ? [text('acquisition')]
              : [],
            objective: text('objective'),
            landingPath: '/book-consultation/',
          },
          transport,
        );
        if (result.status !== 'handoff') {
          resetPending();
          showStatus(
            'status' in result && 'message' in result
              ? result.message
              : 'The request could not be confirmed. Please contact us directly.',
          );
        }
        // No conversion event: navigating to verification does not confirm receipt.
      });
      window.addEventListener('pageshow', () => {
        resetPending();
        status.hidden = true;
      });
      document.addEventListener('securitypolicyviolation', (event) => {
        if (pending && event.violatedDirective === 'form-action') {
          resetPending();
          showStatus(
            'Your browser could not open the verification page. Please contact us by email or WhatsApp.',
          );
        }
      });
    });
}
