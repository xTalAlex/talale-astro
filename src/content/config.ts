// 1. Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
import { rssSchema } from "@astrojs/rss";

// 2. Define your collection(s)
const projectCollection = defineCollection({
  // schema: rssSchema.extend({
  //   gallery: z.array(z.string()).optional()
  // }),
  schema: ({ image }) =>
    z.object({
      logo: z.string().optional(),
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      link: z.string(),
      gallery: z.array(z.string()).optional(),
      portfolio: z.boolean().optional(),
    }),
});

const certificateCollection = defineCollection({
  // schema: rssSchema.extend({
  //   gallery: z.array(z.string()).optional()
  // }),
  schema: ({ image }) =>
    z.object({
      logo: z.string().optional(),
      title: z.string(),
      image: z.string(),
      obtainedAt: z.date(),
      hidden: z.boolean().optional(),
    }),
});

// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
  projects: projectCollection,
};
