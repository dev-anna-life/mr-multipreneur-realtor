/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0a1628',
        gold: '#c8a45c',
        'gold-light': '#e8d5a3',
        cream: '#f8f4ec',
        charcoal: '#1a1a2e',
        slate: '#4a5568',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
