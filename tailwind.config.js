/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#0a0a0a',
          lighter: '#1a1a1a',
          card: '#121212'
        },
        neon: {
          blue: '#00f3ff',
          purple: '#bc13fe',
          pink: '#ff0055'
        }
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #00f3ff, 0 0 10px #00f3ff' },
          '100%': { boxShadow: '0 0 20px #bc13fe, 0 0 30px #bc13fe' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' }
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 3s infinite linear',
      },
    },
  },
  plugins: [],
};
