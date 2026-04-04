import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const projectCollection = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.{md,mdx}",
    base: "./src/content/projects",
  }),
  schema: z.object({
    thumb: z.string().optional(),
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    link: z.url(),
    gallery: z.array(z.string()).optional(),
    portfolio: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

export const collections = {
  projects: projectCollection,
};
