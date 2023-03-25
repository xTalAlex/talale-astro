import { defineConfig } from 'astro/config';
import Config from './src/site_config.json';
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
          branch: 'master'
        },
        collections: [
          {
            name: 'settings',
            label: 'Impostazioni',
            files: [
              {
                name: 'site_config',
                label: 'Configurazione Sito',
                file: 'src/site_config.json',
                fields: [
                  { label: "URL", name: "url", widget: "string" },
                  { label: "Titolo", name: "title", widget: "string" },
                  { label: "Sottotitolo", name: "subtitle", widget: "string" },
                  { label: "Descrizione", name: "description", widget: "string"},
                  { label: "Blog URL", name: "blogUrl", widget: "string" },
                  { label: "Categoria Blog", name: "blogCategory", widget: "string" },
                  { label: "CTA", name: "cta", widget: "string" },
                  { label: "Biografia", name: "biography", widget: "string" },
                  { label: "Prefisso Blocco Codice", name: "defaultCodePrefix", widget: "string" },
                  { label: "MessageBox - Placeholder", name: "messageBoxPlaceholder", widget: "string" },
                  { label: "MessageBox - Conferma", name: "messageBoxSuccess", widget: "string" },
                  { label: "MessageBox - Errore", name: "messageBoxError", widget: "string" },
                  { label: "Giochi per Pagina", name: "gamesPerPage", widget: "number", value_type: "int", min: 1 },
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