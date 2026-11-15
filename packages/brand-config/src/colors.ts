/**
 * KORMETRIX Official Brand Colors
 * Single source of truth for color system
 */
export const BRAND_COLORS = {
  primary: '#14243F', // Deep Navy
  secondary: '#3158D8', // Royal Blue
  accent: '#19B89A', // Vivid Teal
  backgroundLight: '#F5F7FB',
  backgroundDark: '#101827',
  surface: '#FFFFFF',
  textPrimary: '#17243B',
  textSecondary: '#667085',
  borderLight: '#E2E8F0',
  borderDark: '#1E293B',
  emeraldSuccess: '#10B981',
  amberWarning: '#F59E0B',
  roseDanger: '#EF4444',
  purplePortal: '#8B5CF6',
} as const;

export type BrandColors = typeof BRAND_COLORS;
