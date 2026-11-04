let disposePipelineExplorer: (() => void) | undefined;

export function initializePipelineExplorer() {
  disposePipelineExplorer?.();
  const pipeline = document.querySelector<HTMLElement>('[data-pipeline-story]');
  const tabList = pipeline?.querySelector<HTMLOListElement>(
    '[data-pipeline-tabs]',
  );
  const tabs = Array.from(
    pipeline?.querySelectorAll<HTMLAnchorElement>('[data-pipeline-tab]') ?? [],
  );
  const panels = Array.from(
    pipeline?.querySelectorAll<HTMLElement>('[data-pipeline-panel]') ?? [],
  );
  if (!pipeline || !tabList || !tabs.length || tabs.length !== panels.length)
    return;

  const listeners = new AbortController();
  let navigate: ((index: number) => void) | undefined;
  const panelContainer = pipeline.querySelector<HTMLElement>(
    '[data-pipeline-panels]',
  );
  const reservePanelSpace = (): void => {
    if (!panelContainer) return;
    let maxHeight = 0;
    // Measure every real panel at the current width, then restore its state in
    // the same frame. Switching stages cannot move the sections below it.
    panels.forEach((panel) => {
      const wasHidden = panel.hidden;
      panel.hidden = false;
      maxHeight = Math.max(maxHeight, panel.getBoundingClientRect().height);
      panel.hidden = wasHidden;
    });
    panelContainer.style.minHeight = `${Math.ceil(maxHeight)}px`;
  };
  const activate = (activeIndex: number, focus = false): void => {
    tabs.forEach((tab, index) => {
      const selected = index === activeIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[index]?.toggleAttribute('hidden', !selected);
      tab.closest('li')?.toggleAttribute('data-selected', selected);
      tab.closest('li')?.toggleAttribute('data-active', index <= activeIndex);
    });
    if (focus) tabs[activeIndex]?.focus();
    pipeline.style.setProperty(
      '--pipeline-progress',
      String(activeIndex / (tabs.length - 1)),
    );
  };
  const select = (index: number, focus = false): void => {
    activate(index, focus);
    navigate?.(index);
  };

  tabList.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.closest('li')?.setAttribute('role', 'presentation');
    tab.setAttribute('role', 'tab');
    const panel = panels[index];
    if (!panel) return;
    tab.setAttribute('aria-controls', panel.id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    tab.addEventListener(
      'click',
      (event) => {
        // Modified clicks retain the native deep link, which also works without JS.
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        event.preventDefault();
        select(index);
      },
      { signal: listeners.signal },
    );
    tab.addEventListener(
      'keydown',
      (event) => {
        let nextIndex: number;
        switch (event.key) {
          case ' ':
          case 'Enter':
            event.preventDefault();
            select(index);
            return;
          case 'ArrowRight':
            nextIndex = (index + 1) % tabs.length;
            break;
          case 'ArrowLeft':
            nextIndex = (index - 1 + tabs.length) % tabs.length;
            break;
          case 'Home':
            nextIndex = 0;
            break;
          case 'End':
            nextIndex = tabs.length - 1;
            break;
          default:
            return;
        }
        event.preventDefault();
        select(nextIndex, true);
      },
      { signal: listeners.signal },
    );
  });
  activate(0);
  pipeline.dataset.explorerReady = 'true';
  reservePanelSpace();
  // The home story controller measures again on font load and viewport changes.
  disposePipelineExplorer = () => {
    listeners.abort();
    delete pipeline.dataset.explorerReady;
    pipeline.style.removeProperty('--pipeline-progress');
    panelContainer?.style.removeProperty('min-height');
    tabList.removeAttribute('role');
    tabs.forEach((tab) => {
      tab.removeAttribute('role');
      tab.removeAttribute('aria-controls');
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');
      tab.closest('li')?.removeAttribute('role');
      tab.closest('li')?.removeAttribute('data-selected');
      tab.closest('li')?.removeAttribute('data-active');
    });
    panels.forEach((panel) => {
      panel.hidden = false;
      panel.removeAttribute('role');
      panel.removeAttribute('tabindex');
      const heading = panel.querySelector('h3');
      if (heading) panel.setAttribute('aria-labelledby', heading.id);
    });
  };
  return {
    activate,
    reservePanelSpace,
    setNavigation(handler: typeof navigate) {
      navigate = handler;
    },
    dispose: disposePipelineExplorer,
  };
}
