export type LogoTheme = 'light' | 'dark';
export type LogoVariant = 'lockup' | 'wordmark' | 'mark' | 'stacked';

export interface LogoAsset {
  /** Prefer an approved local SVG with a viewBox. */
  src: string;
  width: number;
  height: number;
}

export type LogoAssets = Partial<
  Record<LogoTheme, Partial<Record<LogoVariant, LogoAsset>>>
>;

export const brandProfileImage = {
  src: '/brand/markevance-social-profile-1080x1080.png',
  width: 1080,
  height: 1080,
  alt: 'Markevance M+V monogram in Champagne on a Sovereign Navy background',
} as const;

// Keys describe the background: light artwork on dark, dark artwork on light.
// Supplied 2026-11-02: preserve the original artwork in public/brand.
export const logoAssets: LogoAssets = {
  dark: {
    wordmark: {
      src: '/brand/markevance-01-wordmark-dark.svg',
      width: 1000,
      height: 220,
    },
    stacked: {
      src: '/brand/markevance-05b-combination-stacked.svg',
      width: 800,
      height: 520,
    },
    lockup: {
      src: '/brand/markevance-logo-dark.svg',
      width: 1350,
      height: 300,
    },
    mark: { src: '/brand/markevance-monogram.svg', width: 250, height: 235 },
  },
  light: {
    lockup: {
      src: '/brand/markevance-logo-light.svg',
      width: 1350,
      height: 300,
    },
  },
};
