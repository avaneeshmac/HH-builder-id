/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#0B0F17',
          light: '#161F30',
          dark: '#05070B',
        },
        goa: {
          teal: '#0D9488',
          emerald: '#10B981',
          orange: '#F97316',
          yellow: '#F59E0B',
          coral: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Outfit', 'Inter', 'sans-serif'],
        mono: ['Space Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
