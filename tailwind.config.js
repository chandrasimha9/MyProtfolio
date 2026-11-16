/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        mono: {
          black: '#000000',
          darkest: '#050505',
          dark: '#0A0A0A',
          card: '#121212',
          cardHover: '#181818',
          border: '#222222',
          borderLight: '#333333',
          muted: '#888888',
          silver: '#CCCCCC',
          light: '#EEEEEE',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      letterSpacing: {
        cinematic: '0.25em',
        tightest: '-0.05em',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('light', ['html.light &', '.light &']);
    },
  ],
};
