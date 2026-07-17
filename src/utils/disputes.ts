import type { LocalizedText, Source, ScorecardDimension } from './settlements';

/** The three defeated Axis nations tracked by the dispute ledger. */
export type DisputeCountry = 'germany' | 'japan' | 'italy';

/** Persistence flavour of an ongoing controversy. Drives the status chip. */
export type DisputeStatus = 'recurring' | 'unresolved' | 'escalating' | 'ongoing';

/** A curated, verifiable social-media post used as a primary source. Rendered in
 *  the site's own style; `embed: true` opts a single post into the official
 *  X widget (see components/disputes/XEmbed.astro). Never a live feed. */
export interface DisputeSocialSource {
  platform: 'x' | 'other';
  author: string;
  handle?: string;
  url: string;
  archiveUrl?: string;
  date?: string;
  quote?: LocalizedText;
  embed?: boolean;
}

export interface Dispute {
  id: string;
  date: string; // ISO "YYYY-MM-DD"
  country: DisputeCountry;
  dimension: ScorecardDimension;
  status: DisputeStatus;
  headline: LocalizedText;
  summary: LocalizedText;
  socialSource?: DisputeSocialSource;
  sources: Source[];
  verificationStatus?: 'verified' | 'needs-review' | 'disputed';
  lastReviewed?: string;
  disputed?: string;
}

/** The country filter order (matches the settlements dashboard). */
export const DISPUTE_COUNTRIES: DisputeCountry[] = ['japan', 'germany', 'italy'];

/** Newest development first. Dates are ISO strings, so lexical sort is correct. */
export function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

/** Whole years elapsed between the earliest dispute and now — the "longest
 *  unresolved" headline stat. Computed at build time (Node), so `new Date()`
 *  is fine here. */
export function longestUnresolvedYears(items: { date: string }[]): number {
  if (items.length === 0) return 0;
  const earliest = items.reduce((min, d) => (d.date < min ? d.date : min), items[0].date);
  const start = new Date(earliest).getTime();
  const years = (Date.now() - start) / (365.25 * 24 * 60 * 60 * 1000);
  return Math.floor(years);
}

/** Distinct countries covered, in the fixed filter order. */
export function coveredCountries(items: { country: DisputeCountry }[]): DisputeCountry[] {
  const present = new Set(items.map((d) => d.country));
  return DISPUTE_COUNTRIES.filter((c) => present.has(c));
}
