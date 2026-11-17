/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kerala: {
          dark: '#0B3B24',      // Deep royal Kerala green
          primary: '#0D5C3A',   // Primary emerald
          light: '#1B8A5A',    // Vibrant green
          accent: '#D97706',   // Kerala bronze/gold accent
          gold: '#F59E0B',     // Golden yellow highlight
          surface: '#F4FBF7',  // Soft mint-tinted background
          border: '#D1E7DD',   // Subtle green border
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
