import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ---------------------------------------------------------------------------
// Shared building blocks — reused across every collection so that sourcing and
// review metadata are consistent site-wide. See CONTRIBUTING.md for the rules
// these encode (every entry must cite at least one source; disputed entries
// must explain the dispute).
// ---------------------------------------------------------------------------

const sourceObject = z.object({
  title: z.string(),
  url: z.string().url().optional(),
  author: z.string().optional(),
  publisher: z.string().optional(),
  year: z.number().int().optional(),
  page: z.string().optional(),
  type: z.enum(['book', 'article', 'document', 'archive', 'website', 'other']).optional(),
});

// At least one verifiable source is required for every entry.
const sourceArray = z.array(sourceObject).min(1);

// Accuracy / editorial-review metadata, spread into every schema.
const accuracyFields = {
  verificationStatus: z.enum(['verified', 'needs-review', 'disputed']).default('needs-review'),
  lastReviewed: z.string().optional(), // ISO date "YYYY-MM-DD"
  disputed: z.string().optional(),     // required IFF verificationStatus === 'disputed'
};

// A "disputed" entry must carry an explanation of the dispute.
function requireDisputedNote<T extends { verificationStatus?: string; disputed?: string }>(
  data: T,
  ctx: z.RefinementCtx,
) {
  if (data.verificationStatus === 'disputed' && !data.disputed) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['disputed'],
      message: 'verificationStatus "disputed" requires a `disputed` note explaining the dispute.',
    });
  }
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: z
    .object({
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
      casualties: z
        .object({
          allies: z.number().optional(),
          axis: z.number().optional(),
          civilian: z.number().optional(),
        })
        .optional(),
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z
    .object({
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
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

const aftermath = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/aftermath' }),
  schema: z
    .object({
      title: z.string(),
      date: z.string(),
      category: z.enum(['institution', 'treaty', 'reconstruction', 'coldwar']),
      cover: z.string().optional(),
      tags: z.array(z.string()),
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

const conferences = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conferences' }),
  schema: z
    .object({
      title: z.string(),
      titleEn: z.string().optional(),
      date: z.string(),
      dateEnd: z.string().optional(),
      location: z.string(),
      coordinates: z.tuple([z.number(), z.number()]).optional(),
      participants: z.array(z.string()),
      outcomes: z.array(z.string()),
      cover: z.string().optional(),
      coverCaption: z.string().optional(),
      tags: z.array(z.string()),
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

export const collections = { events, people, aftermath, conferences };
