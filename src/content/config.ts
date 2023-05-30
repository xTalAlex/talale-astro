// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

// 2. Define your collection(s)
const projectCollection = defineCollection({ 
    // schema: rssSchema.extend({
    //   gallery: z.array(z.string()).optional()
    // }),
    schema: z.object({
        title: z.string(),
        pubDate: z.date(),
        description: z.string(),
        link: z.string(),
        gallery: z.array(z.string()).optional(),
    })
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'projects': projectCollection,
};