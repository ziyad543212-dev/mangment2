/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17212b',
        muted: '#73808c',
        canvas: '#f5f7f8',
        line: '#e6eaed',
        brand: { 50: '#eaf8f4', 100: '#d4f0e8', 500: '#168568', 600: '#106d55', 700: '#0e5a47' }
      },
      boxShadow: { card: '0 2px 10px rgba(20, 35, 45, .035)' }
    }
  },
  plugins: []
};
