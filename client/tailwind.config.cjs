/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'hsl(175, 80%, 25%)',
          DEFAULT: 'hsl(175, 80%, 30%)',
          dark: 'hsl(175, 70%, 45%)',
        },
        secondary: {
          light: 'hsl(215, 20%, 50%)',
          DEFAULT: 'hsl(215, 25%, 27%)',
          dark: 'hsl(215, 20%, 75%)',
        },
        background: {
          light: '#F8F9FA',
          dark: '#0B0F19',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#161F30',
        },
        danger: {
          light: '#DC2626',
          DEFAULT: '#EF4444',
          dark: '#F87171',
        },
        warning: {
          light: '#D97706',
          DEFAULT: '#F59E0B',
          dark: '#FBBF24',
        },
        success: {
          light: '#16A34A',
          DEFAULT: '#10B981',
          dark: '#34D399',
        }
      },
      borderRadius: {
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'm3-1': '0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-2': '0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)',
        'm3-3': '0px 1px 3px 0px rgba(0, 0, 0, 0.30), 0px 4px 8px 3px rgba(0, 0, 0, 0.15)',
        'glass-light': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'rain-fall': 'rain 1.5s linear infinite',
      },
      keyframes: {
        rain: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '50%': { opacity: 0.4 },
          '100%': { transform: 'translateY(100vh)', opacity: 0 },
        }
      }
    },
  },
  plugins: [],
}
