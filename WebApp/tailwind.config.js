/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    screens: {
      'sm': '300px',

      'md': '800px',

      'lg': '960px',

      '2xl': '1700px',

    },
    extend: {},
  },
  plugins: [],
}

