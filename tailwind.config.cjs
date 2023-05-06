const defaultTheme = require('tailwindcss/defaultTheme')

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
        'sans': ["Tomorrow",...defaultTheme.fontFamily.sans],
        'serif': ["Rokkitt",...defaultTheme.fontFamily.serif],
      },
      animation: {
        shine: "shine 1s",
      },
      keyframes: {
        shine: {
          "100%": { left: "125%" },
        },
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
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
