/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this covers all your component files
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Bebas Neue', 'Impact', 'sans-serif'],
        'sunshine': ['SUNSHINE', 'system-ui', 'sans-serif'],
      },
      colors: {
        'red-lotus': '#b71c1c',
        'yellow-lotus': '#fbc02d',
        'blue-lotus': '#1976d2',
        'green-lotus': '#388e3c',
        'brown-lotus': '#5d4037',
        'pink-lotus': '#c2185b',
      },
    },
  },
  plugins: [
    // Forms plugin removed to fix build issues
  ],
}
