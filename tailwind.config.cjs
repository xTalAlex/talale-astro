const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}",
  ],
  safelist: [
  ],
  theme: {
    extend: {
      fontFamily: {
        "sans": ["Chakra Petch",...defaultTheme.fontFamily.sans],
        "serif": ["Rokkitt",...defaultTheme.fontFamily.serif],
      },
      animation: {
        shine: "shine 1s",
        wiggle: "wiggle 2s ease-in-out infinite",
      },
      keyframes: {
        shine: {
          "100%": { left: "125%" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    }
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui"), 
  ],
  daisyui: {
    logs: false,
    themes: [
      "halloween",
      {
        "halloween-light": {
          ...require("daisyui/src/colors/themes")["[data-theme=halloween]"],
          "base-100": "#FFF",
        },
      },
    ],
  },
};
