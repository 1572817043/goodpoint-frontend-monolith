/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-red-500', 'bg-red-600', 'bg-red-700',
    'hover:bg-red-600', 'active:bg-red-700',
    'bg-klein-blue', 'hover:bg-blue-600',
    'bg-apple-gray-200', 'text-apple-gray-400', 'text-apple-gray-500',
    'cursor-not-allowed',
  ],
  theme: {
    extend: {
      // 自定义主题色 - 克莱因蓝
      colors: {
        'klein-blue': '#002FA7',
        'apple-gray': {
          50: '#FBFBFD',
          100: '#F5F5F7',
          200: '#E8E8ED',
          300: '#D2D2D7',
          400: '#86868B',
          500: '#6E6E73',
          600: '#424245',
          700: '#333336',
          800: '#1D1D1F',
          900: '#111111',
        }
      },
      // 大圆角
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
