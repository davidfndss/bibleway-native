/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './components/**/*.{js,ts,tsx}', './app/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nowy-Regular'],
        nowy: ['Nowy-Regular'],
        'nowyb': ['Nowy-Bold'],
      },
      colors: {
        c1: '#020808',
        c2: '#EEE6CE',
        c3: '#A0A0A0',
      },
    },
  },
  plugins: [],
};
