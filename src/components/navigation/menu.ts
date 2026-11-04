export function initializeMenu(): void {
  const header = document.querySelector<HTMLElement>('[data-site-header]');
  const menu = header?.querySelector<HTMLDetailsElement>('[data-mobile-menu]');
  const toggle = menu?.querySelector<HTMLElement>('[data-menu-toggle]');
  const navigation = menu?.querySelector<HTMLElement>('nav');
  if (!header || !menu || !toggle || !navigation || header.dataset.menuReady)
    return;

  // Native details supplies keyboard/pointer activation before JS or if it fails.
  header.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      toggle.focus();
    }
  });
  navigation.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a'))
      menu.open = false;
  });
  menu.addEventListener('focusout', (event) => {
    if (
      event.relatedTarget instanceof Node &&
      !menu.contains(event.relatedTarget)
    )
      menu.open = false;
  });
  const desktop = window.matchMedia('(min-width: 80rem)');
  desktop.addEventListener('change', () => {
    const focusWasInMenu = menu.contains(document.activeElement);
    const desktopNavigation = header.querySelector('#primary-navigation');
    const focusWasInDesktop = desktopNavigation?.contains(
      document.activeElement,
    );
    menu.open = false;
    if (desktop.matches && focusWasInMenu)
      desktopNavigation?.querySelector<HTMLAnchorElement>('a')?.focus();
    else if (!desktop.matches && focusWasInDesktop) toggle.focus();
  });
  // Ordinary full-page navigation is used; no client router or duplicate lifecycle.
  header.dataset.menuReady = 'true';
}
