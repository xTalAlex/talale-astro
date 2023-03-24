import { defineConfig } from 'astro/config';
import Config from './src/site.config.js';
import tailwind from '@astrojs/tailwind';
import vue from "@astrojs/vue";
import sitemap from "@astrojs/sitemap";
import NetlifyCMS from 'astro-netlify-cms';

// https://astro.build/config
export default defineConfig({
  site: Config.url,
  integrations: [
    NetlifyCMS({
      config: {
        locale: 'it',
        backend: {
          name: 'git-gateway',
          branch: 'main'
        },
        collections: [
          {
            name: 'settings',
            label: 'Impostazioni',
            files: [
              {
                name: 'site_settings',
                label: 'Impostazioni Sito',
                file: 'src/site_settings.json',
                fields: [
                  { label: "Url", name: "url", widget: "string" },
                ]
              },
            ],
          },
        ],
      },
    }),
    tailwind({
      config: {
        applyBaseStyles: false
      }
    }), 
    vue({ appEntrypoint: '/src/_app' }), 
    sitemap({
      filter: (page) => 
        page !== 'https://talale.it/privacy-policy/' && 
        page !== 'https://talale.it/cookie-policy/'  &&
        !/https:\/\/talale\.it\/nintendo-switch\/([2-9](\d*)|1(\d+))\//.test(page)
    }),
  ]
});