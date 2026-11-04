import { initializeServiceHubMotion } from './service-hub-motion.ts';

/** Small, finite entrances; static content never waits for animation setup. */
export function initializeOverviewMotion(): void {
  const root = document.querySelector<HTMLElement>('.homepage-overview');
  if (!root || root.dataset.overviewMotion) return;
  root.dataset.overviewMotion = 'ready';
  initializeServiceHubMotion();
  if (!('animate' in Element.prototype)) return;

  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set<Animation>();
  const revealed = new WeakSet<Element>();
  const easing = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
  let observer: IntersectionObserver | undefined;

  const animate = (
    element: Element,
    frames: Keyframe[],
    duration: number,
  ): void => {
    const animation = element.animate(frames, { duration, easing });
    running.add(animation);
    const release = (): void => {
      running.delete(animation);
    };
    animation.addEventListener('finish', release, { once: true });
    animation.addEventListener('cancel', release, { once: true });
  };
  const cancel = (): void => {
    running.forEach((animation) => animation.cancel());
    running.clear();
  };
  const sync = (): void => {
    observer?.disconnect();
    cancel();
    if (preference.matches || document.hidden) return;
    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer?.unobserve(entry.target);
          if (revealed.has(entry.target)) return;
          revealed.add(entry.target);
          // Focused controls remain still during keyboard navigation.
          if (entry.target.contains(document.activeElement)) return;
          animate(
            entry.target,
            [
              { opacity: 0.65, transform: 'translateY(14px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
            650,
          );
        });
      },
      { threshold: 0.12 },
    );
    root
      .querySelectorAll(
        '.overview-heading, .overview-services > li, .overview-models, .overview-industry-pair > article, .overview-approach, .overview-insights, .final-cta-layout',
      )
      .forEach((element) => {
        if (!revealed.has(element)) observer?.observe(element);
      });
  };
  preference.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  // Stop offscreen work, and resume observation after a back/forward-cache restore.
  window.addEventListener('pagehide', () => {
    observer?.disconnect();
    cancel();
  });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) sync();
  });
  root.addEventListener('focusin', cancel);
  sync();
}
