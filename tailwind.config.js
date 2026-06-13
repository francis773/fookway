/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#E63946',
        secondary: '#1D3557',
        accent: '#F4A261',
        surface: '#F1FAEE',
        muted: '#A8DADC'
      }
    }
  },
  plugins: []
}
