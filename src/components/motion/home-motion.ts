import { initializePipelineExplorer } from './pipeline-explorer.ts';

interface ScrollStory {
  section: HTMLElement;
  runway: HTMLElement;
  scene: HTMLElement;
  panels: HTMLElement[];
  links: HTMLAnchorElement[];
  activeIndex: number;
  enabled: boolean;
  distance: number;
  top: number;
  select: (index: number) => void;
}

let disposeHomeMotion: (() => void) | undefined;

export function initializeHomeMotion(): void {
  if (typeof window === 'undefined') return;
  disposeHomeMotion?.();
  const homepage = document.querySelector<HTMLElement>('[data-growth-stories]');
  if (!homepage) return;

  const explorer = initializePipelineExplorer();
  const listeners = new AbortController();
  const desktop = window.matchMedia('(min-width: 64rem)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const stories: ScrollStory[] = [];
  let frame = 0;
  let resizeFrame = 0;

  homepage
    .querySelectorAll<HTMLElement>('[data-growth-story], [data-pipeline-story]')
    .forEach((section) => {
      const runway = section.querySelector<HTMLElement>('[data-story-runway]');
      const scene = section.querySelector<HTMLElement>('[data-story-scene]');
      const growth = section.hasAttribute('data-growth-story');
      const panels = Array.from(
        section.querySelectorAll<HTMLElement>(
          growth ? '[data-story-stage]' : '[data-pipeline-panel]',
        ),
      );
      const links = Array.from(
        section.querySelectorAll<HTMLAnchorElement>(
          growth ? '.system-map a' : '[data-pipeline-tab]',
        ),
      );
      if (!runway || !scene || !panels.length || panels.length !== links.length)
        return;
      const nodes = Array.from(
        section.querySelectorAll<HTMLElement>(
          growth ? '[data-story-node]' : '[data-pipeline-node]',
        ),
      );
      const segments = Array.from(section.querySelectorAll('[data-flow-step]'));
      const count = section.querySelector('[data-story-count]');
      const story: ScrollStory = {
        section,
        runway,
        scene,
        panels,
        links,
        activeIndex: -1,
        enabled: false,
        distance: 0,
        top: 0,
        select(index) {
          if (story.activeIndex === index) return;
          // Never leave keyboard focus inside a panel that becomes unavailable.
          const previous = panels[story.activeIndex];
          if (previous?.contains(document.activeElement))
            links[index]?.focus({ preventScroll: true });
          story.activeIndex = index;
          if (growth) {
            panels.forEach((panel, i) => {
              panel.toggleAttribute('data-current', i === index);
              panel.inert = story.enabled && i !== index;
              if (story.enabled && i !== index)
                panel.setAttribute('aria-hidden', 'true');
              else panel.removeAttribute('aria-hidden');
            });
            links.forEach((link, i) => {
              if (i === index) link.setAttribute('aria-current', 'step');
              else link.removeAttribute('aria-current');
            });
            nodes.forEach((node, i) =>
              node.toggleAttribute('data-active', i <= index),
            );
            segments.forEach((segment, i) =>
              segment.toggleAttribute('data-active', i <= index),
            );
            section.style.setProperty(
              '--story-progress',
              String(index / (panels.length - 1)),
            );
          } else explorer?.activate(index);
          if (count)
            count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(panels.length).padStart(2, '0')}`;
        },
      };
      stories.push(story);
      if (growth)
        links.forEach((link, index) => {
          link.addEventListener(
            'click',
            (event) => {
              if (
                !story.enabled ||
                event.ctrlKey ||
                event.metaKey ||
                event.shiftKey ||
                event.altKey
              )
                return;
              event.preventDefault();
              if (location.hash !== link.hash)
                history.pushState(null, '', link.hash);
              navigate(story, index);
            },
            { signal: listeners.signal },
          );
        });
      else explorer?.setNavigation((index) => navigate(story, index));
    });

  const navigate = (story: ScrollStory, index: number): void => {
    story.select(index);
    if (!story.enabled) return;
    const start =
      story.runway.getBoundingClientRect().top + window.scrollY - story.top;
    // Land inside the stage interval, away from rounding boundaries.
    window.scrollTo({
      top: start + ((index + 0.5) / story.panels.length) * story.distance,
      behavior: 'instant',
    });
  };

  const syncScroll = (): void => {
    frame = 0;
    stories.forEach((story) => {
      if (!story.enabled) return;
      const progress =
        (story.top - story.runway.getBoundingClientRect().top) / story.distance;
      const index = Math.max(
        0,
        Math.min(
          story.panels.length - 1,
          Math.floor(progress * story.panels.length),
        ),
      );
      story.select(index);
    });
  };
  const queueScroll = (): void => {
    if (!frame) frame = requestAnimationFrame(syncScroll);
  };

  const configure = (): void => {
    resizeFrame = 0;
    const readingStory = stories.find((story) => {
      const bounds = story.runway.getBoundingClientRect();
      return (
        story.enabled &&
        bounds.top <= story.top &&
        bounds.bottom >= story.top + story.scene.getBoundingClientRect().height
      );
    });
    const readingIndex = readingStory?.activeIndex ?? 0;
    stories.forEach((story) => {
      const previousIndex = Math.max(0, story.activeIndex);
      story.enabled = desktop.matches && !reducedMotion.matches;
      story.section.toggleAttribute('data-scroll-story', story.enabled);
      story.runway.style.removeProperty('height');
      story.scene.style.removeProperty('top');
      // Overlapping grid cells reserve the tallest stage, including disclosures.
      if (story.section.hasAttribute('data-pipeline-story'))
        explorer?.reservePanelSpace();
      const margin =
        parseFloat(getComputedStyle(document.documentElement).fontSize) * 1.5;
      const height = story.scene.getBoundingClientRect().height;
      if (height + margin * 2 > window.innerHeight) story.enabled = false;
      story.section.toggleAttribute('data-scroll-story', story.enabled);
      if (story.enabled) {
        story.top = Math.max(margin, (window.innerHeight - height) / 2);
        story.distance =
          story.panels.length * Math.min(440, window.innerHeight * 0.55);
        story.scene.style.top = `${story.top}px`;
        story.runway.style.height = `${height + story.distance}px`;
      } else {
        story.panels.forEach((panel) => {
          panel.inert = false;
          panel.removeAttribute('aria-hidden');
        });
        if (story.section.hasAttribute('data-pipeline-story'))
          explorer?.reservePanelSpace();
      }
      story.activeIndex = -1;
      story.select(previousIndex);
    });
    if (readingStory) {
      navigate(readingStory, readingIndex);
      if (!readingStory.enabled) {
        readingStory.panels[readingIndex]?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        });
      }
    }
    syncScroll();
  };

  const syncHash = (): void => {
    for (const story of stories) {
      const index = story.panels.findIndex(
        (panel) => `#${panel.id}` === location.hash,
      );
      if (index < 0) continue;
      navigate(story, index);
      if (!story.enabled)
        story.panels[index]?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        });
      const panel = story.panels[index];
      if (panel) {
        panel.tabIndex = panel.hasAttribute('data-pipeline-panel') ? 0 : -1;
        panel.focus({ preventScroll: true });
      }
      return;
    }
  };

  window.addEventListener('scroll', queueScroll, {
    passive: true,
    signal: listeners.signal,
  });
  window.addEventListener(
    'resize',
    () => {
      if (!resizeFrame) resizeFrame = requestAnimationFrame(configure);
    },
    { signal: listeners.signal },
  );
  window.addEventListener('hashchange', syncHash, { signal: listeners.signal });
  homepage.addEventListener(
    'click',
    (event) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
          : null;
      if (
        !link ||
        !stories.some((story) =>
          story.panels.some((panel) => `#${panel.id}` === link.hash),
        )
      )
        return;
      // Repeated hero links must also reveal their stage when the hash is unchanged.
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      syncHash();
    },
    { signal: listeners.signal },
  );
  window.addEventListener('pageshow', configure, { signal: listeners.signal });
  desktop.addEventListener('change', configure, { signal: listeners.signal });
  reducedMotion.addEventListener('change', configure, {
    signal: listeners.signal,
  });
  homepage.addEventListener(
    'toggle',
    (event) => {
      if (
        event.target instanceof Element &&
        event.target.matches('.stage-capabilities')
      )
        configure();
    },
    { capture: true, signal: listeners.signal },
  );
  configure();
  syncHash();
  void document.fonts.ready.then(() => {
    if (listeners.signal.aborted) return;
    configure();
    syncHash();
  });

  disposeHomeMotion = () => {
    listeners.abort();
    cancelAnimationFrame(frame);
    cancelAnimationFrame(resizeFrame);
    stories.forEach((story) => {
      story.section.removeAttribute('data-scroll-story');
      story.section.style.removeProperty('--story-progress');
      story.runway.style.removeProperty('height');
      story.scene.style.removeProperty('top');
      story.panels.forEach((panel) => {
        panel.inert = false;
        panel.removeAttribute('aria-hidden');
        panel.removeAttribute('data-current');
        panel.removeAttribute('tabindex');
      });
      story.links.forEach((link) => link.removeAttribute('aria-current'));
      story.section
        .querySelectorAll('[data-active]')
        .forEach((node) => node.removeAttribute('data-active'));
    });
    explorer?.dispose();
  };
}
