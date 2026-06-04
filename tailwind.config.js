/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./BabyInvitation.jsx"
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-elegant': ['Playfair Display', 'serif'],
        'cinzel': ['Cinzel Decorative', 'serif'],
        'sans-clean': ['Plus Jakarta Sans', 'sans-serif']
      },
      colors: {
        marine: {
          50: '#e0faff',
          100: '#b3f0ff',
          200: '#80e5ff',
          300: '#4dd9ff',
          400: '#1acdff',
          500: '#00b4d8',
          600: '#0096c7',
          700: '#0077b6',
          800: '#023e8a',
          900: '#03045e'
        },
        coral: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d'
        }
      },
      spacing: {
        'container-margin': '24px',
        'stack-lg': '48px',
        'stack-md': '24px',
        'stack-sm': '12px',
        'unit': '8px'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 4s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 3s ease-in-out infinite'
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' }
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        }
      },
      backdropBlur: {
        'xs': '2px'
      },
      boxShadow: {
        'marine': '0 4px 15px rgba(0, 180, 216, 0.3)',
        'coral': '0 4px 15px rgba(239, 68, 68, 0.3)',
        'glow': '0 0 20px rgba(0, 180, 216, 0.5)'
      }
    },
  },
  plugins: [],
}
