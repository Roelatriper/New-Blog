import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["配置指南", "基础原理", "科创情报", "协作文档"]),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    readingMinutes: z.number().int().positive(),
    featured: z.boolean().default(false),
    accent: z.enum(["mint", "violet", "pink", "ink"]).default("mint"),
    draft: z.boolean().default(false),
    order: z.number().default(100)
  })
});

export const collections = { articles };
