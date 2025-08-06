// Asset paths and constants
export const ASSET_PATHS = {
  images: {
    logo: '/src/assets/images/logo.svg',
  },
  icons: {
    favicon: '/src/assets/icons/favicon.svg',
    app192: '/src/assets/icons/icon-192x192.png',
    app512: '/src/assets/icons/icon-512x512.png',
  },
} as const;

// Re-export static data constants
export * from './data/constants';