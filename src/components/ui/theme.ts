type ColorMode = 'light' | 'dark';

export function initializeTheme(): void {
  const root = document.documentElement;
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    '[data-theme-toggle]',
  );
  const device = window.matchMedia('(prefers-color-scheme: dark)');
  const storageKey = 'markevance-color-mode';
  let preference: ColorMode | null = null;

  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // The switch also works for this page when storage is unavailable.
  }

  function apply(mode: ColorMode): void {
    root.dataset.colorMode = mode;
    buttons.forEach((button) => {
      const label = `Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`;
      button.setAttribute('aria-label', label);
      button.title = label;
      const text = button.querySelector('[data-theme-label]');
      if (text) text.textContent = label;
      button.hidden = false;
    });
    document.dispatchEvent(new Event('color-mode-change'));
  }

  const deviceMode = (): ColorMode => (device.matches ? 'dark' : 'light');
  apply(preference ?? deviceMode());
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      preference = root.dataset.colorMode === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // Keep the visitor's selection active without browser storage.
      }
      apply(preference);
    });
  });
  device.addEventListener('change', () => {
    if (!preference) apply(deviceMode());
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== storageKey && event.key !== null) return;
    preference =
      event.newValue === 'light' || event.newValue === 'dark'
        ? event.newValue
        : null;
    apply(preference ?? deviceMode());
  });
}
