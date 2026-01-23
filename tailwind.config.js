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
