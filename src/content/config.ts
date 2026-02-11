import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string().optional(),
    icon: z.string().default('shield'),
    iconColor: z.string().default('text-blue-500'),
    ogImage: z.string().optional(),
  }),
});

export const collections = { articles };
