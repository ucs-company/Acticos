/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#171717', 900: '#212121', 800: '#2B2B2B', 700: '#383838', 600: '#4A4A4A' },
        electric: { DEFAULT: '#4E8A2E', 600: '#3F7024', 300: '#86B363' },
        cyan: { DEFAULT: '#6FAF42', 300: '#9CCB78' },
        mist: { DEFAULT: '#F2F3F0', 200: '#E4E7E2', 400: '#A6ADA3', 600: '#5F675C' },
        ink: '#2B2B2B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        lift: '0 1px 0 rgba(43,43,43,.04), 0 12px 32px -12px rgba(43,43,43,.18)',
        glow: '0 0 0 1px rgba(111,175,66,.35), 0 16px 48px -16px rgba(78,138,46,.5)',
      },
      maxWidth: { page: '1280px' },
    },
  },
  plugins: [],
};
