/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Logo-matched greens
        primary: {
          50: '#f0f7f1',
          100: '#dceedd',
          200: '#b8ddb9',
          300: '#8cc78f',
          400: '#7cb342',  // Light lime green (logo leaf)
          500: '#2d8659',  // Medium teal-green (logo figure)
          600: '#1a5f2a',  // Dark forest green (logo text/leaf)
          700: '#155724',
          800: '#10451d',
          900: '#0c3516',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#7b2d8e',  // Logo purple (matches "Re" text)
          700: '#6b2480',
          800: '#5a1d6e',
          900: '#481558',
          950: '#3b0764',
        },
        earth: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        accent: {
          teal: '#2d8659',    // Logo medium green
          lime: '#7cb342',    // Logo light green
          forest: '#1a5f2a',  // Logo dark green
        },
      },
    },
  },
  plugins: [],
}
