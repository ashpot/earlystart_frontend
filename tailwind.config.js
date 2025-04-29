/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'custom-dark': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        primary: '#FAD02C',
        secondary: '#90ADC6',
        secondaryDark: '#333652',
        tertiary: '#D9D9D9',
      }
    },
  },
  plugins: [],
};

