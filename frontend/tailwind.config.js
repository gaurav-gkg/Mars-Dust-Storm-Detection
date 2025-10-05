/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mars: {
          50: '#fef5ee',
          100: '#fde9d7',
          200: '#faceae',
          300: '#f6ac7a',
          400: '#f28044',
          500: '#ee5f1f',
          600: '#df4515',
          700: '#b93213',
          800: '#932a17',
          900: '#762515',
        },
        space: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      backgroundImage: {
        'mars-gradient': 'linear-gradient(135deg, #1a1625 0%, #2d1b3d 25%, #3d2647 50%, #1a1625 100%)',
        'space-gradient': 'linear-gradient(to bottom, #000000, #0a0a1a, #1a0a2e)',
        'dust-particle': 'radial-gradient(circle, rgba(238,95,31,0.6) 0%, rgba(238,95,31,0) 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'dust': 'dust 20s linear infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 0.75s step-end infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(238,95,31,0.5), 0 0 10px rgba(238,95,31,0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(238,95,31,0.8), 0 0 30px rgba(238,95,31,0.5)' },
        },
        dust: {
          '0%': { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(100vh) translateX(100px) rotate(360deg)', opacity: '0' },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blink: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'rgba(238,95,31,1)' },
        },
      },
    },
  },
  plugins: [],
}

