/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#d0e2ff',
          200: '#a6c8ff',
          300: '#78a9ff',
          400: '#4589ff',
          500: '#0f62fe', // azul IBM
          600: '#0043ce',
          700: '#002d9c',
          800: '#001d6c',
          900: '#001141',
        },
        accent: {
          50: '#f5faff',
          100: '#e0f7fa',
          200: '#b2ebf2',
          300: '#4fd1c5',
          400: '#06b6d4', // cyan
          500: '#0891b2',
          600: '#0e7490',
          700: '#155e75',
          800: '#164e63',
          900: '#083344',
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#64748b',
          500: '#334155',
          600: '#1e293b',
          700: '#0f172a',
          800: '#0a0f1a',
          900: '#050816',
        },
        success: '#22c55e',
        warning: '#facc15',
        error: '#ef4444',
        info: '#38bdf8',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(16,30,54,0.10)',
        'focus': '0 0 0 3px #0f62fe44',
      },
      borderRadius: {
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      transitionProperty: {
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
}
