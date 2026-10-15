/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F7F5',
          100: '#E8F0EC',
          200: '#C8DBD1',
          300: '#9DBEB0',
          500: '#4A7A62',
          700: '#2E5A44',
          800: '#234433',
          900: '#193024',
          DEFAULT: '#2E5A44',
        },
        mint: {
          50: '#F5FAF7',
          100: '#E8F0EC',
          200: '#D1E6DC',
          500: '#52B788',
          DEFAULT: '#E8F0EC',
        },
        offwhite: '#FBFBF9',
        charcoal: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          500: '#64748B',
          700: '#334155',
          800: '#1F2937',
          900: '#0F172A',
          DEFAULT: '#1F2937',
        },
        amber: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        coral: {
          DEFAULT: '#E11D48',
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#F43F5E',
          600: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['"Times New Roman"', 'Times', 'serif'],
      },
      borderRadius: {
        none: '0px',
      },
    },
  },
  plugins: [],
}
