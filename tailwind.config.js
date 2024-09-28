/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-main": "#223fc7",
        "orange-main": "#ffac1a"
      }
    }
  },
  plugins: []
}
