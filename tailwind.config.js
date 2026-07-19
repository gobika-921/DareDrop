/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./theme/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          elevated: "rgb(var(--color-surface-elevated) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          container: "rgb(var(--color-primary-container) / <alpha-value>)",
        },
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        "text-primary": "rgb(var(--color-text-primary) / <alpha-value>)",
        "text-secondary": "rgb(var(--color-text-secondary) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "System"],
        display: ["Poppins", "System"],
      },
    },
  },
  plugins: [],
};
