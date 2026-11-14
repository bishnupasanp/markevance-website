/** Decorative signals enhance ordinary links and never control navigation. */
export function initializeServiceHubMotion(): void {
  const hub = document.querySelector<HTMLElement>('[data-growth-hub]');
  const stage = hub?.querySelector<HTMLElement>('.growth-hub-stage');
  const canvas = hub?.querySelector<HTMLCanvasElement>('[data-growth-field]');
  const toggle = hub?.querySelector<HTMLButtonElement>('[data-hub-toggle]');
  if (!hub || !stage || !canvas || !toggle || hub.dataset.hubReady) return;
  if (!('IntersectionObserver' in window) || !('ResizeObserver' in window))
    return;
  hub.dataset.hubReady = 'true';

  const listeners = new AbortController();
  const options = { signal: listeners.signal };
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia(
    '(min-width: 64rem) and (hover: hover) and (pointer: fine)',
  );
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  const lowPower = Boolean(
    connection?.saveData ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4),
  );
  let colors: string[] = [];
  const duration = 12_000;
  const frameInterval = 1000 / 30;
  const particlesPerOrbit = 21;
  const pointerTravel = 14;
  let context: CanvasRenderingContext2D | null = null;
  let bounds: DOMRect | undefined;
  let width = 0;
  let height = 0;
  let frame = 0;
  let lastTime = 0;
  let lastPaint = 0;
  let elapsed = 0;
  let visible = false;
  let paused = false;
  let pointerX = 0;
  let pointerY = 0;
  let driftX = 0;
  let driftY = 0;

  function draw(): void {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    driftX += (pointerX - driftX) * 0.08;
    driftY += (pointerY - driftY) * 0.08;
    for (let index = 0; index < particlesPerOrbit * 2; index++) {
      const angle =
        (index / particlesPerOrbit) * Math.PI * 2 + elapsed * 0.000065;
      const rotation = index < particlesPerOrbit ? -0.48 : 0.48;
      const x = Math.cos(angle) * width * 0.42;
      const y = Math.sin(angle) * height * 0.32;
      const projectedX =
        width / 2 + x * Math.cos(rotation) - y * Math.sin(rotation) + driftX;
      const projectedY =
        height / 2 + x * Math.sin(rotation) + y * Math.cos(rotation) + driftY;
      context.globalAlpha = 0.25 + (index % 4) * 0.12;
      context.fillStyle = colors[index % 5 === 0 ? 1 : 0]!;
      context.beginPath();
      context.arc(
        projectedX,
        projectedY,
        index % 5 === 0 ? 1.6 : 1,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
    context.globalAlpha = 1;
  }
  function resize(): void {
    if (!context) return;
    bounds = stage!.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas!.width = Math.round(width * ratio);
    canvas!.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }
  function tick(timestamp: number): void {
    frame = 0;
    if (lastTime) elapsed += Math.min(timestamp - lastTime, 100);
    lastTime = timestamp;
    if (timestamp - lastPaint >= frameInterval) {
      draw();
      lastPaint = timestamp;
    }
    if (elapsed >= duration) {
      paused = true;
      sync();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  function sync(): void {
    const eligible = desktop.matches && !reduced.matches && !lowPower;
    if (!eligible && context) {
      canvas!.width = 0;
      canvas!.height = 0;
      context = null;
    }
    if (eligible && visible && !context) {
      context = canvas!.getContext('2d');
      const palette = getComputedStyle(hub!);
      colors = [
        palette.getPropertyValue('--color-link-dark').trim(),
        palette.getPropertyValue('--color-accent-prestige').trim(),
      ];
      resize();
    }
    toggle!.hidden = !eligible || !context;
    toggle!.textContent =
      elapsed >= duration
        ? 'Replay motion'
        : paused
          ? 'Resume motion'
          : 'Pause motion';
    toggle!.setAttribute('aria-pressed', String(paused));
    const running =
      eligible && Boolean(context) && visible && !document.hidden && !paused;
    hub!.toggleAttribute('data-hub-running', running);
    if (!running) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      if (reduced.matches) context?.clearRect(0, 0, width, height);
    } else if (!frame) frame = requestAnimationFrame(tick);
  }
  toggle.addEventListener(
    'click',
    () => {
      if (elapsed >= duration) {
        elapsed = 0;
        paused = false;
      } else paused = !paused;
      sync();
    },
    options,
  );
  stage.addEventListener(
    'pointerenter',
    () => {
      if (context) bounds = stage.getBoundingClientRect();
    },
    options,
  );
  stage.addEventListener(
    'pointermove',
    (event) => {
      if (!context || !bounds) return;
      pointerX =
        ((event.clientX - bounds.left) / bounds.width - 0.5) * pointerTravel;
      pointerY =
        ((event.clientY - bounds.top) / bounds.height - 0.5) * pointerTravel;
    },
    options,
  );
  stage.addEventListener(
    'pointerleave',
    () => {
      pointerX = 0;
      pointerY = 0;
    },
    options,
  );
  reduced.addEventListener('change', sync, options);
  desktop.addEventListener('change', sync, options);
  document.addEventListener('visibilitychange', sync, options);
  const intersection = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    sync();
  });
  const size = new ResizeObserver(resize);
  intersection.observe(stage);
  size.observe(stage);
  window.addEventListener(
    'pagehide',
    () => {
      listeners.abort();
      intersection.disconnect();
      size.disconnect();
      cancelAnimationFrame(frame);
      canvas.width = 0;
      canvas.height = 0;
      hub.removeAttribute('data-hub-ready');
      hub.removeAttribute('data-hub-running');
      window.addEventListener('pageshow', () => initializeServiceHubMotion(), {
        once: true,
      });
    },
    { once: true },
  );
  sync();
}
