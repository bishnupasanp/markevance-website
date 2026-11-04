/** Motion enhances normal links; it never controls navigation or content. */
export function initializeServiceHubMotion(): void {
  const hub = document.querySelector<HTMLElement>('[data-growth-hub]');
  const toggle = hub?.querySelector<HTMLButtonElement>('[data-hub-toggle]');
  if (!hub || !toggle || hub.hasAttribute('data-hub-ready')) return;
  hub.setAttribute('data-hub-ready', '');

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const supportsVisibility = 'IntersectionObserver' in window;
  let paused = false;
  let visible = false;
  const update = (): void => {
    toggle.hidden = preference.matches || !supportsVisibility;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    hub.toggleAttribute(
      'data-hub-running',
      !paused && !preference.matches && !document.hidden && visible,
    );
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    update();
  });
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);

  // Without an observer the diagram remains static; its links still work.
  const observer = supportsVisibility
    ? new IntersectionObserver((entries) => {
        visible = entries.some((entry) => entry.isIntersecting);
        update();
      })
    : undefined;
  observer?.observe(hub);
  window.addEventListener('pagehide', () => {
    visible = false;
    update();
    observer?.disconnect();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) observer?.observe(hub);
  });
  update();
}
