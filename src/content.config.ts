import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";
// import { rssSchema } from "@astrojs/rss";

const projectCollection = defineCollection({
  // schema: rssSchema.extend({
  //   gallery: z.array(z.string()).optional()
  // }),
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/data/projects",
  }),
  schema: () =>
    z.object({
      thumb: z.string().optional(),
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      link: z.string(),
      gallery: z.array(z.string()).optional(),
      portfolio: z.boolean().optional(),
      featured: z.boolean().optional(),
    }),
});

export const collections = {
  projects: projectCollection,
};
