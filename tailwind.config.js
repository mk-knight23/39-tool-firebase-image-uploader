/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'asset': {
          'bg': '#f8fafc',
          'dark': '#0f172a',
          'primary': '#6366f1',
          'accent': '#06b6d4',
          'danger': '#f43f5e',
        },
        'gallery': {
          'bg': '#fafafa',
          'surface': '#ffffff',
          'surface-alt': '#f3f4f6',
          'text-primary': '#111827',
          'text-secondary': '#6b7280',
          'text-muted': '#9ca3af',
          'primary': '#6366f1',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
