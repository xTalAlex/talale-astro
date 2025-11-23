import { defineConfig } from "astro/config";
import Config from "./src/config/general.json";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from "@keystatic/astro";

export default defineConfig({
  site: Config.url,
  output: "static",

  adapter: netlify({
    imageCDN: false,
  }),

  integrations: [
    vue({
      appEntrypoint: "/src/_app",
    }),
    icon(),
    sitemap({
      filter: (page) =>
        !/^https:\/\/talale\.it\/admin/.test(page) &&
        !/^https:\/\/talale\.it\/keystatic/.test(page) &&
        !/^https:\/\/talale\.it\/privacy-policy/.test(page) &&
        !/^https:\/\/talale\.it\/cookie-policy/.test(page) &&
        !/^https:\/\/talale\.it\/profile/.test(page) &&
        !/https:\/\/talale\.it\/nintendo-switch\/([2-9](\d*)|1(\d+))\//.test(
          page,
        ),
    }),
    react(),
    markdoc(),
    keystatic(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
