/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
      },
      colors: {
        peach: {
          light: "#FFDAB9", // Light shade of peach
          DEFAULT: "#FF9966", // Default shade of peach
          dark: "#E68A5E",
        },
        lavender: {
          light: "#e9dae9",
          mid: "#c8a2c8",
          dark: "#8c718c",
          verydark: "#282028",
        },
        skyblue: {
          DEFAULT: "#87CEEB",
        },
        steelblue: {
          DEFAULT: "#4682B4",
        },
        teal: {
          light: "#daf2f0",
          normal: "#6bc9c2",
          default: "#46bcb3",
          darker: "#38968f",
          dark: "#153836",
        },
        airbnbpink: {
          verylight: "#fcd7df",
          light: "#f5728e",
          original: "#F1355D",
          darker: "#c12a4a",
          dark: "#48101c",
        },
      },
    },
  },
  plugins: [require("daisyui")],
};
