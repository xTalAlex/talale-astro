import { defineConfig } from "astro/config";
import Config from "./src/site_config.json";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import db from "@astrojs/db";
import sentry from "@sentry/astro";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: Config.url,
  output: "hybrid",
  adapter: netlify({
    imageCDN: false,
  }),
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
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
});
