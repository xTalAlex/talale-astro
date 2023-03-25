// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';
import { rssSchema } from '@astrojs/rss';

// 2. Define your collection(s)
const postCollection = defineCollection({ 
    schema: z.object({
        title: z.string(),
        date: z.date(),
        featuredImage: z.string(),
        gallery: z.array(z.string()).optional(),
  })
});

const projectCollection = defineCollection({ 
    schema: z.object({
        rssSchema,
        screenshot: z.string(),
        completed: z.boolean(),
    })
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  'posts': postCollection,
  'projects': projectCollection,
};