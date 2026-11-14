/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '../../packages/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        navy: {
          900: '#0F172A',
          800: '#17243B',
          700: '#1E293B',
        },
        brand: {
          navy: '#17243B',
          blue: '#3758D8',
          blueHover: '#2A46B5',
          teal: '#16A389',
          tealHover: '#12826D',
          cyan: '#06B6D4',
        },
        background: {
          light: '#F5F7FB',
          dark: '#101827',
        },
        surface: {
          white: '#FFFFFF',
          card: '#FFFFFF',
          cardDark: '#1E293B',
          border: '#E2E8F0',
        },
        text: {
          primary: '#17243B',
          secondary: '#667085',
          muted: '#94A3B8',
        },
        status: {
          present: '#10B981',
          late: '#F59E0B',
          absent: '#EF4444',
          onLeave: '#8B5CF6',
        },
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        bangla: ['"Hind Siliguri"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
