import { defineConfig } from "astro/config";
import Config from "./src/config/general.json";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import db from "@astrojs/db";
import netlify from "@astrojs/netlify";
import tailwindcss from "@tailwindcss/vite";
// import sentry from "@sentry/astro";

// https://astro.build/config
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
    sitemap({
      filter: (page) =>
        page !== "https://talale.it/admin/" &&
        page !== "https://talale.it/privacy-policy/" &&
        page !== "https://talale.it/cookie-policy/" &&
        page !== "https://talale.it/profile/" &&
        !/https:\/\/talale\.it\/nintendo-switch\/([2-9](\d*)|1(\d+))\//.test(
          page,
        ) &&
        !/^https:\/\/talale\.it\/medabots/.test(page),
    }),
    icon(),
    db(),
    // sentry({
    //   dsn: "https://6e8081bce1069ada88740b7adf6088c4@o4506858882334720.ingest.us.sentry.io/4506858899439616",
    //   sourceMapsUploadOptions: {
    //     project: "javascript-astro",
    //     authToken: process.env.SENTRY_AUTH_TOKEN,
    //   },
    // }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
