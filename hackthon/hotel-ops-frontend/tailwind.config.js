/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hotel: {
          navy: '#0F172A',
          gold: '#D4AF37',
          emerald: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          sky: '#0EA5E9',
        }
      }
    },
  },
  plugins: [],
}
