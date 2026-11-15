/**
 * KORMETRIX Core Brand Configuration for Web Platform
 */
export const BRAND_CONFIG = {
  name: 'KORMETRIX',
  shortName: 'KORMETRIX',
  tagline: 'People. Work. Performance.',
  description: 'Enterprise Workforce Management Platform.',
  category: 'Enterprise SaaS / HRMS / Workforce Management',
  version: '2.0.0',

  products: {
    superAdmin: 'KORMETRIX Control',
    companyAdmin: 'Kormetrix Company',
    hrAdmin: 'Kormetrix People',
    manager: 'Kormetrix Team',
    employee: 'Kormetrix Desk',
    mobileApp: 'Kormetrix Go',
    attendance: 'Kormetrix Time',
    payroll: 'Kormetrix Pay',
  },

  colors: {
    primary: '#14243F', // Deep Navy
    secondary: '#3158D8', // Royal Blue
    accent: '#19B89A', // Vivid Teal
    backgroundLight: '#F5F7FB',
    backgroundDark: '#101827',
    surface: '#FFFFFF',
    textPrimary: '#17243B',
    textSecondary: '#667085',
  },

  assets: {
    logo: '/logo.png',
    logoWhite: '/logo-white.png',
    symbol: '/kormetrix-symbol.png',
    favicon: '/favicon.ico',
    faviconSvg: '/favicon.svg',
    icon: '/icon.png',
    appleTouchIcon: '/apple-touch-icon.png',
    splash: '/splash-logo.png',
  },

  metadata: {
    title: 'KORMETRIX — Enterprise Workforce Management Platform',
    titleTemplate: '%s | KORMETRIX',
    tagline: 'People. Work. Performance.',
    description:
      'Manage employees, attendance, payroll, HR operations and team performance with KORMETRIX, an integrated enterprise workforce management platform.',
    siteUrl: 'https://workforce360-eight.vercel.app',
    copyright: `© ${new Date().getFullYear()} KORMETRIX. All rights reserved.`,
  },
} as const;

export type BrandConfig = typeof BRAND_CONFIG;

export interface BrandConfiguration {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  appName: string;
  version: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    backgroundLight: string;
    backgroundDark: string;
    surface: string;
  };
  assets: {
    logo: string;
    logoWhite: string;
    symbol: string;
    icon: string;
  };
}

export const DEFAULT_BRAND_CONFIG: BrandConfiguration = {
  name: BRAND_CONFIG.name,
  shortName: BRAND_CONFIG.shortName,
  tagline: BRAND_CONFIG.tagline,
  description: BRAND_CONFIG.description,
  appName: 'Kormetrix Go',
  version: BRAND_CONFIG.version,
  colors: {
    primary: BRAND_CONFIG.colors.primary,
    secondary: BRAND_CONFIG.colors.secondary,
    accent: BRAND_CONFIG.colors.accent,
    backgroundLight: BRAND_CONFIG.colors.backgroundLight,
    backgroundDark: BRAND_CONFIG.colors.backgroundDark,
    surface: BRAND_CONFIG.colors.surface,
  },
  assets: {
    logo: BRAND_CONFIG.assets.logo,
    logoWhite: BRAND_CONFIG.assets.logoWhite,
    symbol: BRAND_CONFIG.assets.symbol,
    icon: BRAND_CONFIG.assets.icon,
  },
};

export const BRAND_COLORS = BRAND_CONFIG.colors;

export const PRODUCT_MODULES = {
  control: { name: 'KORMETRIX Control', role: 'Super Admin', desc: 'Platform fleet & multi-tenant governance' },
  company: { name: 'Kormetrix Company', role: 'Company Admin', desc: 'Single-tenant operations & branches' },
  people: { name: 'Kormetrix People', role: 'HR Admin', desc: 'Recruitment & employee lifecycle' },
  team: { name: 'Kormetrix Team', role: 'Team Manager', desc: 'Department rosters & shift monitoring' },
  desk: { name: 'Kormetrix Desk', role: 'Employee Portal', desc: 'Geofence punch clock & 3D ID cards' },
  go: { name: 'Kormetrix Go', role: 'Mobile App', desc: 'Flutter Android & iOS native app' },
};

