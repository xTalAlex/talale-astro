import { defineConfig } from "astro/config";
import Config from "./src/site_config.json";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  site: Config.url,
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
  ],
});
