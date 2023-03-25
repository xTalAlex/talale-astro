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
      adminPath: '/admin',
      config: {
        site_url: Config.url,
        display_url: Config.url,
        logo_url: Config.url + '/icon.png',
        locale: 'it',
        media_folder: "src/assets/uploads",
        public_folder: "/assets/uploads",
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
                editor: {
                  preview: false,
                },
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
          {
            name: 'posts',
            label: 'Posts',
            folder: 'src/content/posts',
            preview_path: 'posts/{{slug}}',
            create: true,
            fields: [
              { label: "Titolo", name: "title", widget: "string" },
              { label: "Data", name: "date", widget: "datetime"},
              { label: "Immagine in Evidenza", name: "featuredImage", widget: "image" },
              { label: "Contenuto", name: "body", widget: "markdown" },
              { label: "Galleria", name: "gallery", widget: "list", summary: '{{fields.image}}', field: { label: "Immagine", name: "image", widget: "image"} }
            ]
          }
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