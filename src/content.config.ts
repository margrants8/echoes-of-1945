import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    date: z.string(),
    dateEnd: z.string().optional(),
    location: z.string(),
    coordinates: z.tuple([z.number(), z.number()]).optional(),
    theater: z.enum(['europe', 'pacific', 'africa', 'other']),
    tags: z.array(z.string()),
    cover: z.string().optional(),
    coverCaption: z.string().optional(),
    significance: z.enum(['minor', 'major', 'turning-point']),
    casualties: z.object({
      allies: z.number().optional(),
      axis: z.number().optional(),
      civilian: z.number().optional(),
    }).optional(),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
      author: z.string().optional(),
    })).optional(),
  }),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    nameEn: z.string().optional(),
    born: z.string(),
    died: z.string().optional(),
    nationality: z.string(),
    role: z.string(),
    side: z.enum(['allies', 'axis', 'neutral']),
    photo: z.string().optional(),
    tags: z.array(z.string()),
    relatedEvents: z.array(z.string()).optional(),
  }),
});

const aftermath = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aftermath' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    category: z.enum(['institution', 'treaty', 'reconstruction', 'coldwar']),
    cover: z.string().optional(),
    tags: z.array(z.string()),
    sources: z.array(z.object({
      title: z.string(),
      url: z.string().optional(),
    })).optional(),
  }),
});

export const collections = { events, people, aftermath };
