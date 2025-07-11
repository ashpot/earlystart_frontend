/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'custom-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        primary: '#FAD02C',
        primaryLight: '#F5F90C4D',
        secondary: '#90ADC6',
        secondaryDark: '#333652',
        secondaryLight: '#E2EDF6',
        secondaryDark2: '#181A2B',
        tertiary: '#D9D9D9',
        tertiaryDark: '#E9EAEC',
        tertiaryLight: '#EFEFEF',
      }
    },
  },
  plugins: [],
};

