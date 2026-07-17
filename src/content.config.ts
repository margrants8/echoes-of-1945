import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

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

const technology = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/technology' }),
  schema: z
    .object({
      title: z.string(),
      titleEn: z.string().optional(),
      type: z.enum(['aircraft', 'armor', 'naval', 'infantry', 'electronic', 'nuclear', 'other']),
      nation: z.string(),
      introduced: z.string().optional(),
      tags: z.array(z.string()),
      cover: z.string().optional(),
      coverCaption: z.string().optional(),
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

const warCrimes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/war-crimes' }),
  schema: z
    .object({
      title: z.string(),
      titleEn: z.string().optional(),
      date: z.string(),
      location: z.string(),
      type: z.enum(['genocide', 'massacre', 'tribunal', 'persecution', 'forced-labor', 'other']),
      victims: z
        .object({
          group: z.string().optional(),
          estimateLow: z.number().optional(),
          estimateHigh: z.number().optional(),
        })
        .optional(),
      tags: z.array(z.string()),
      cover: z.string().optional(),
      coverCaption: z.string().optional(),
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

// Data collection — ongoing post-war disputes ("持续争议"). Each entry is a
// dated, sourced controversy that keeps a defeated nation's reckoning contested
// (e.g. Yasukuni visits, reparations claims). Bilingual inline text, so it lives
// in one JSON file rather than per-language markdown. An optional `socialSource`
// carries a curated, verifiable public post (e.g. an official X account) as a
// primary source — rendered in the site's own style, never via a live feed.
const localizedText = z.object({ en: z.string(), zh: z.string() });

const disputes = defineCollection({
  loader: file('./src/data/disputes.json'),
  schema: z
    .object({
      id: z.string(),
      date: z.string(), // ISO "YYYY-MM-DD"; latest development, used to sort newest-first
      country: z.enum(['germany', 'japan', 'italy']),
      // Reuses the reckoning scorecard's four dimensions so each dispute links
      // back to the score it presses on (see utils/settlements SCORECARD_DIMENSIONS).
      dimension: z.enum(['execution', 'military', 'apology', 'warmongering']),
      status: z.enum(['recurring', 'unresolved', 'escalating', 'ongoing']),
      headline: localizedText,
      summary: localizedText,
      socialSource: z
        .object({
          platform: z.enum(['x', 'other']),
          author: z.string(),
          handle: z.string().optional(),
          url: z.string().url(),
          archiveUrl: z.string().url().optional(),
          date: z.string().optional(),
          quote: localizedText.optional(),
          embed: z.boolean().default(false),
        })
        .optional(),
      sources: sourceArray,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

// Data collection — per-country WWII deaths. Numeric + short localized name
// only (no free-text notes), so it stays bilingual without per-row prose.
const casualties = defineCollection({
  loader: file('./src/data/casualties.json'),
  schema: z
    .object({
      id: z.string(),
      name: z.object({ en: z.string(), zh: z.string() }),
      side: z.enum(['allies', 'axis', 'neutral']),
      military: z.number().optional(),
      civilian: z.number().optional(),
      total: z.number(),
      note: z.object({ en: z.string(), zh: z.string() }).optional(),
      source: sourceObject,
      ...accuracyFields,
    })
    .superRefine(requireDisputedNote),
});

export const collections = { events, people, aftermath, conferences, technology, warCrimes, casualties, disputes };
