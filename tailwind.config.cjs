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
        'sans': [...defaultTheme.fontFamily.sans],
        'serif': [...defaultTheme.fontFamily.serif],
        'mono': [...defaultTheme.fontFamily.mono],
      }
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
      "emerald"
    ],
  },
};
