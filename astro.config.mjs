import { defineConfig } from 'astro/config';
import Config from './src/site.config.js';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
    site: Config.url,
    integrations: [
        tailwind({
            config: { applyBaseStyles: false },
        })
    ],
});
