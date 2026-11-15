/**
 * KORMETRIX Core Brand Definition
 * Single source of truth for platform and role sub-products
 */
import { BRAND_COLORS } from './colors';
import { BRAND_ASSETS } from './assets';
import { BRAND_METADATA } from './metadata';

export const BRAND_CONFIG = {
  name: 'KORMETRIX',
  shortName: 'KORMETRIX',
  tagline: 'People. Work. Performance.',
  description: 'Enterprise Workforce Management Platform.',
  category: 'Enterprise SaaS / HRMS / Workforce Management',
  version: '2.0.0',
  buildVersion: 1,

  // Role and Sub-product names
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

  colors: BRAND_COLORS,
  assets: BRAND_ASSETS,
  metadata: BRAND_METADATA,
} as const;

export type BrandConfig = typeof BRAND_CONFIG;
