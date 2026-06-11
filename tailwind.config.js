/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E4E9B',
        gold: '#8BC53F',
        'gold-light': '#a0d85c',
        cream: '#f8f9fc',
        charcoal: '#0d0d24',
        slate: '#6b7280',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
