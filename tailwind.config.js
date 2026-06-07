/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#171738',
        gold: '#8EF9F3',
        'gold-light': '#b0f7f2',
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
