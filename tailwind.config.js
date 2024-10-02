/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-main": "#223fc7",
        "orange-main": "#ffac1a",
        "navy": "#16243f"
      },
      fontFamily: {
        baloo: ['"Baloo 2"', "sans-serif"]
      }
    }
  },
  plugins: []
}
