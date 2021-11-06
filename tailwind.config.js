module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#7C5DFA',
        secondary: '#9277FF',
        dark: '#1E2139',
        dark2: '#252945',
        text1: '#DFE3FA',
        text2: '#888EB0',
        text3: '#7E88C3',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('tailwind-scrollbar-hide')],
}
