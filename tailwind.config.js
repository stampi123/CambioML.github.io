/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'cambio-blue-0': 'var(--cambio-blue-0)',
        'cambio-blue-1': 'var(--cambio-blue-1)',
        'cambio-blue-2': 'var(--cambio-blue-2)',
        'cambio-blue-3': 'var(--cambio-blue-3)',
        'cambio-blue-4': 'var(--cambio-blue-4)',
      },
    },
  },
  plugins: [],
};
