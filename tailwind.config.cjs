const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}",
  ],
  safelist: [],
  theme: {
    extend: {
      screens: {
        print: { raw: "print" },
      },
      fontFamily: {
        sans: ["Chakra Petch", ...defaultTheme.fontFamily.sans],
        serif: [
          "Rockwell",
          "Rockwell Nova",
          "Roboto Slab",
          "DejaVu Serif",
          "Sitka Small",
        ],
        mono: ["VT323", ...defaultTheme.fontFamily.mono],
      },
      animation: {
        shine: "shine 1s",
        wiggle: "wiggle 2s ease-in-out infinite",
        marquee: "marquee 10s linear infinite",
      },
      keyframes: {
        shine: {
          "100%": { left: "125%" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        halloween: {
          ...require("daisyui/src/theming/themes")["halloween"],
          primary: "#ff972a",
          secondary: "#69398b",
          neutral: "#1B1D1D",
        },
      },
      {
        "halloween-light": {
          ...require("daisyui/src/theming/themes")["halloween"],
          primary: "#ff972a",
          secondary: "#69398b",
          neutral: "#1B1D1D",
          "base-100": "#FFF",
        },
      },
    ],
  },
};
