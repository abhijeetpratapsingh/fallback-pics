/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          dark: '#6D28D9',
          light: '#8B5CF6',
        },
        accent: {
          blue: '#3B82F6',
          green: '#10B981',
          orange: '#F97316',
        }
      },
      fontFamily: {
        sans: ['var(--font-web)'],
        mono: ['var(--font-web)'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
        'gradient-hover': 'linear-gradient(135deg, #6D28D9 0%, #2563EB 100%)',
      }
    },
  },
  plugins: [],
}
