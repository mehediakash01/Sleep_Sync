import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode surfaces
        surface: {
          DEFAULT: '#F8F8F7', // Light surface
          container: {
            DEFAULT: '#F0EFED',
            low: '#F5F5F3',
            high: '#E8E7E5',
            highest: '#E0DFDD',
          },
          variant: '#E8E7E5',
        },
        // Dark mode surfaces (primary palette)
        'surface-dark': {
          DEFAULT: '#14130F',
          container: {
            DEFAULT: '#21201B',
            low: '#1D1C17',
            high: '#2B2A25',
            highest: '#35342E',
          },
          variant: '#36352F',
        },
        // Primary gradient: Lavender to Deep Purple
        primary: {
          DEFAULT: '#C4C1FB',
          container: '#100C3D',
          fixed: '#E8E5FF',
          'fixed-dim': '#C4C1FB',
        },
        // Secondary: Soft Teal Glow
        secondary: {
          DEFAULT: '#52FFDC',
          fixed: '#52FFDC',
          'fixed-dim': '#00DFBD',
        },
        // Text colors
        'on-surface': {
          DEFAULT: '#1C1B16',
          'light-default': '#F8F8F7',
          variant: '#C6C6CD',
          'variant-light': '#49484E',
        },
        // Outline for ghost borders
        outline: {
          DEFAULT: '#79747E',
          variant: '#45464D', // Dark mode
          'variant-light': '#CAC7D0', // Light mode
        },
        // Sleep-specific colors
        'quality-high': '#00DFBD', // Deep sleep indicator
        'quality-good': '#52FFDC', // Good sleep
        'quality-fair': '#B19CD9', // Fair sleep (purple)
        'quality-poor': '#FF6B6B', // Poor sleep
      },
      fontSize: {
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'headline-md': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'title-lg': ['1.375rem', { lineHeight: '1.3', letterSpacing: '0' }],
        'body-md': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'label-sm': ['0.6875rem', { lineHeight: '1.25', letterSpacing: '0.05em' }],
      },
      fontFamily: {
        display: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        full: '9999px',
      },
      boxShadow: {
        'ambient': '0 32px 64px rgba(10, 20, 40, 0.06)',
        'glass': '0 8px 32px rgba(10, 20, 40, 0.08)',
        'glow': '0 0 24px rgba(82, 255, 220, 0.25)',
        'glow-purple': '0 0 24px rgba(196, 193, 251, 0.25)',
      },
      animation: {
        pulse: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        breathing: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        gutter: '1.5rem',
        'gutter-lg': '2rem',
        'gutter-xl': '3rem',
      },
    },
  },
  plugins: [],
};

export default config;
