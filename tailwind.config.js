module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // adjust paths as needed
  theme: {
    extend: {
      keyframes: {
        scaleFade: {
          "0%":   { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" }
        }
      },
      animation: {
        scaleFade: "scaleFade 120ms ease-out"
      }
    }
  },
  plugins: []
};