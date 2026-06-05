/** @type {import('tailwindcss').Config} */
const semanticColors = {
  brand: 'var(--color-brand)',
  'brand-hover': 'var(--color-brand-hover)',
  'brand-strong': 'var(--color-brand-strong)',
  'brand-soft': 'var(--color-brand-soft)',
  'brand-muted': 'var(--color-brand-muted)',
  'brand-border': 'var(--color-brand-border)',
  surface: 'var(--color-surface)',
  'surface-subtle': 'var(--color-surface-subtle)',
  'surface-muted': 'var(--color-surface-muted)',
  text: 'var(--color-text)',
  'text-muted': 'var(--color-text-muted)',
  'text-soft': 'var(--color-text-soft)',
  border: 'var(--color-border)',
  focus: 'var(--color-focus)',
  success: 'var(--color-success)',
  'success-soft': 'var(--color-success-soft)',
  warning: 'var(--color-warning)',
  'warning-soft': 'var(--color-warning-soft)',
  danger: 'var(--color-danger)',
  'danger-soft': 'var(--color-danger-soft)',
  info: 'var(--color-info)',
  'info-soft': 'var(--color-info-soft)',
  'code-surface': 'var(--color-code-surface)',
  'code-text': 'var(--color-code-text)',
};

const neutralScale = {
  50: 'var(--color-surface-subtle)',
  100: 'var(--color-surface-muted)',
  200: 'var(--color-border)',
  300: 'var(--color-border-strong)',
  400: 'var(--color-text-disabled)',
  500: 'var(--color-text-soft)',
  600: 'var(--color-text-muted)',
  700: '#3f3f46',
  800: 'var(--color-code-surface-border)',
  900: 'var(--color-code-surface)',
  950: 'var(--color-text)',
};

const brandScale = {
  50: 'var(--color-brand-soft)',
  100: 'var(--color-brand-muted)',
  200: 'var(--color-brand-border)',
  300: '#c4b5fd',
  400: '#a78bfa',
  500: '#8b5cf6',
  600: 'var(--color-brand)',
  700: 'var(--color-brand)',
  800: 'var(--color-brand-hover)',
  900: 'var(--color-brand-text-strong)',
  950: '#2e1065',
};

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ...semanticColors,
        primary: {
          DEFAULT: 'var(--color-brand)',
          dark: 'var(--color-brand-hover)',
          light: '#8b5cf6',
        },
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          orange: '#f97316',
        },
        violet: brandScale,
        purple: brandScale,
        zinc: neutralScale,
        gray: neutralScale,
        emerald: {
          50: 'var(--color-success-soft)',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: 'var(--color-code-accent)',
          400: '#34d399',
          500: '#10b981',
          600: 'var(--color-success)',
          700: 'var(--color-success-text)',
          950: '#022c22',
        },
        blue: {
          50: 'var(--color-info-soft)',
          100: '#dbeafe',
          500: '#3b82f6',
          600: 'var(--color-info)',
          700: '#1d4ed8',
        },
        orange: {
          50: 'var(--color-warning-soft)',
          500: '#f97316',
          600: 'var(--color-warning)',
          700: '#c2410c',
        },
        red: {
          50: 'var(--color-danger-soft)',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          700: '#b91c1c',
          900: '#7f1d1d',
          950: '#450a0a',
        },
      },
      fontFamily: {
        sans: ['var(--font-web)'],
        mono: ['var(--font-web)'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, var(--color-brand) 0%, #3b82f6 100%)',
        'gradient-hover': 'linear-gradient(135deg, var(--color-brand-hover) 0%, var(--color-info) 100%)',
      }
    },
  },
  plugins: [],
}
