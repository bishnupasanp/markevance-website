import { createHash } from 'node:crypto';

export const themeBootstrap = `(() => {
  let preference;
  try {
    preference = localStorage.getItem('markevance-color-mode');
  } catch {
    // Fall back to the device setting when browser storage is restricted.
  }
  document.documentElement.dataset.colorMode =
    preference === 'light' || preference === 'dark'
      ? preference
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
})();`;

export const themeBootstrapHash =
  `sha256-${createHash('sha256').update(themeBootstrap).digest('base64')}` as const;
