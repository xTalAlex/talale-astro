import { defineConfig } from 'astro/config';
import Config from './src/site.config.js';
import tailwind from '@astrojs/tailwind';
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: Config.url,
  integrations: [
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }), 
    vue(), 
    sitemap({
      filter: (page) => 
        page !== 'https://talale.it/privacy-policy/' && 
        page !== 'https://talale.it/cookie-policy/'  &&
        !/https:\/\/talale\.it\/nintendo-switch\/([2-9](\d*)|1(\d+))\//.test(page)
    })
  ]
});