/**
 * WorkForce 360 - Design System Tokens
 * Enterprise Color Palette, Typography, Spacing, and Localization Defaults
 */

export const colors = {
  brand: {
    primaryNavy: '#17243B',
    primaryBlue: '#3758D8',
    primaryBlueHover: '#2A46B5',
    accentTeal: '#16A389',
    accentTealHover: '#12826D',
    accentCyan: '#06B6D4',
    gradientStart: '#17243B',
    gradientMid: '#3758D8',
    gradientEnd: '#16A389',
    heroGradient: 'linear-gradient(135deg, #17243B 0%, #1E3A8A 50%, #3758D8 100%)',
  },
  surface: {
    light: '#F5F7FB',
    dark: '#101827',
    white: '#FFFFFF',
    cardLight: '#FFFFFF',
    cardDark: '#1E293B',
    borderLight: '#E2E8F0',
    borderDark: '#334155',
    sidebarDark: '#111827',
    topbarLight: '#FFFFFF',
  },
  text: {
    primaryLight: '#17243B',
    secondaryLight: '#667085',
    mutedLight: '#94A3B8',
    primaryDark: '#F8FAFC',
    secondaryDark: '#94A3B8',
    mutedDark: '#64748B',
  },
  status: {
    success: '#10B981',
    successBg: '#ECFDF5',
    warning: '#F59E0B',
    warningBg: '#FFFBEB',
    error: '#EF4444',
    errorBg: '#FEF2F2',
    info: '#3B82F6',
    infoBg: '#EFF6FF',
    present: '#10B981',
    late: '#F59E0B',
    absent: '#EF4444',
    onLeave: '#8B5CF6',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    bangla: '"Hind Siliguri", "Noto Sans Bengali", Kalpurush, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
} as const;

export const spacing = {
  px: '1px',
  0: '0px',
  1: '0.25rem', // 4px
  2: '0.5rem',  // 8px
  3: '0.75rem', // 12px
  4: '1rem',    // 16px
  5: '1.25rem', // 20px
  6: '1.5rem',  // 24px
  8: '2rem',    // 32px
  10: '2.5rem', // 40px
  12: '3rem',   // 48px
  16: '4rem',   // 64px
} as const;

export const radii = {
  none: '0px',
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.25rem',// 20px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

export const localizationDefaults = {
  country: 'Bangladesh',
  countryCode: 'BD',
  phoneCode: '+880',
  timezone: 'Asia/Dhaka',
  currency: 'BDT',
  currencySymbol: '৳',
  defaultLocale: 'bn',
  supportedLocales: ['bn', 'en'] as const,
  dateFormat: 'DD-MM-YYYY',
  timeFormat: 'hh:mm A',
} as const;

/**
 * Format currency amount into Bangladesh style (e.g. ৳ 2,45,000)
 */
export function formatBDT(amount: number, options?: { showSymbol?: boolean }): string {
  const showSymbol = options?.showSymbol ?? true;
  const isNegative = amount < 0;
  const absVal = Math.abs(amount);
  
  // South Asian numbering system: 2,45,000
  const parts = absVal.toFixed(2).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] !== '00' ? `.${parts[1]}` : '';

  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const otherNumbers = integerPart.substring(0, integerPart.length - 3);
    integerPart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  const formatted = `${isNegative ? '-' : ''}${integerPart}${decimalPart}`;
  return showSymbol ? `৳ ${formatted}` : formatted;
}
