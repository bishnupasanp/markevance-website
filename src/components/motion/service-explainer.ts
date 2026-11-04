export function initializeServiceExplainers(): void {
  document
    .querySelectorAll<HTMLElement>('[data-service-explainer]')
    .forEach((root) => {
      if (root.dataset.enhanced) return;
      const list = root.querySelector<HTMLOListElement>('[data-service-tabs]');
      const tabs = Array.from(
        root.querySelectorAll<HTMLAnchorElement>('[data-service-tab]'),
      );
      const panels = Array.from(
        root.querySelectorAll<HTMLElement>('[data-service-panel]'),
      );
      if (!list || tabs.length < 2 || tabs.length !== panels.length) return;

      const activate = (active: number, focus = false): void => {
        tabs.forEach((tab, index) => {
          const selected = index === active;
          tab.setAttribute('aria-selected', String(selected));
          tab.toggleAttribute('data-complete', index <= active);
          tab.tabIndex = selected ? 0 : -1;
          const panel = panels[index];
          if (!panel) return;
          panel.toggleAttribute('data-active', selected);
          panel.inert = !selected;
          panel.setAttribute('aria-hidden', String(!selected));
        });
        root.style.setProperty(
          '--service-progress',
          String(active / (tabs.length - 1)),
        );
        if (focus) tabs[active]?.focus();
      };
      const syncHash = (): void => {
        const index = panels.findIndex(
          (panel) => `#${panel.id}` === location.hash,
        );
        if (index >= 0) activate(index);
      };
      list.setAttribute('role', 'tablist');
      const horizontal = window.matchMedia('(min-width: 48rem)');
      const syncOrientation = (): void => {
        list.setAttribute(
          'aria-orientation',
          horizontal.matches ? 'horizontal' : 'vertical',
        );
      };
      syncOrientation();
      horizontal.addEventListener('change', syncOrientation);
      tabs.forEach((tab, index) => {
        const panel = panels[index];
        if (!panel) return;
        tab.closest('li')?.setAttribute('role', 'presentation');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        tab.addEventListener('click', (event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
            return;
          event.preventDefault();
          activate(index);
        });
        tab.addEventListener('keydown', (event) => {
          const keys: Record<string, number> = {
            ArrowRight: (index + 1) % tabs.length,
            ArrowDown: (index + 1) % tabs.length,
            ArrowLeft: (index - 1 + tabs.length) % tabs.length,
            ArrowUp: (index - 1 + tabs.length) % tabs.length,
            Home: 0,
            End: tabs.length - 1,
          };
          if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            activate(index);
          } else {
            const next = keys[event.key];
            if (next === undefined) return;
            event.preventDefault();
            activate(next, true);
          }
        });
      });
      activate(0);
      syncHash();
      root.dataset.enhanced = 'true';
      window.addEventListener('hashchange', syncHash);
      // Full-page navigation is used; no persistent router duplicates listeners.
    });
}
