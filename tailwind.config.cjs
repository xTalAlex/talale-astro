module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{astro,js,jsx,svelte,ts,tsx,vue}",
  ],
  safelist: [
  ],
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui"), 
  ],
  daisyui: {
    themes: [
      "halloween",
      "emerald"
    ],
  },
};
