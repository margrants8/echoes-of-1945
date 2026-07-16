import type { Lang } from '../i18n';

export type ClauseStatus = 'executed' | 'partial' | 'not-executed' | 'disputed';

/** A short text available in both site languages. */
export interface LocalizedText {
  en: string;
  zh: string;
}

/** Resolve a LocalizedText for the current language (falls back to the other). */
export function pick(value: LocalizedText, lang: Lang): string {
  return value[lang] ?? value.en ?? value.zh;
}

export interface Source {
  title: string;
  url?: string;
  author?: string;
  publisher?: string;
  year?: number;
  page?: string;
  type?: 'book' | 'article' | 'document' | 'archive' | 'website' | 'other';
}

export interface Clause {
  id: string;
  category: string;
  label: LocalizedText;
  status: ClauseStatus;
  executedYear: number | null;
  reversedAt?: number | null;
  disputed: boolean;
  complianceScore: number;
  note: LocalizedText;
  sources?: Source[];
}

/**
 * Fixed order of the post-war reckoning scorecard dimensions. Also used as the
 * i18n lookup keys (`t.settlements.reckoning.dimension[key]`) and as the column
 * order in the comparison dashboard, so the order here is significant.
 */
export const SCORECARD_DIMENSIONS = ['execution', 'military', 'apology', 'warmongering'] as const;
export type ScorecardDimension = (typeof SCORECARD_DIMENSIONS)[number];

/**
 * One assessed dimension of a defeated nation's post-war reckoning.
 * All scores are directionally consistent: 1 = best behaved. Note that
 * `warmongering` is scored as a *peace commitment* (1 = no aggressive signs,
 * strong peace commitment; 0 = active warmongering) so the four dimensions can
 * be averaged into a single "who reckoned best" ranking.
 */
export interface ScorecardEntry {
  score: number; // 0..1, higher = more fully reckoned / more peaceful & constrained
  verdict: LocalizedText; // one-line summary shown in the dashboard cell
  note: LocalizedText; // longer, sourced explanation
  disputed?: boolean;
  sources?: Source[];
}

export type Scorecard = Record<ScorecardDimension, ScorecardEntry>;

export interface SettlementData {
  country: string;
  displayName: LocalizedText;
  treaty: LocalizedText;
  occupationEnd: string;
  sovereigntyRestored: string;
  overallCompliance: number;
  scorecard: Scorecard;
  clauses: Clause[];
}

export const statusColor: Record<ClauseStatus, string> = {
  executed: 'var(--color-executed)',
  partial: 'var(--color-partial)',
  'not-executed': 'var(--color-not-executed)',
  disputed: 'var(--color-disputed)',
};

export function compliancePercent(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/** Mean of the four dimension scores (0-1). All dimensions are equally weighted. */
export function reckoningScore(card: Scorecard): number {
  const values = SCORECARD_DIMENSIONS.map((d) => card[d].score);
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/** Goodness band driving the green→amber→red scale in the dashboard. */
export type ScoreBand = 'good' | 'mixed' | 'concerning';

/** Thresholds are UI banding only (they never alter stored scores). */
export function scoreBand(score: number): ScoreBand {
  if (score >= 0.7) return 'good';
  if (score >= 0.4) return 'mixed';
  return 'concerning';
}

export function groupByCategory(clauses: Clause[]): Record<string, Clause[]> {
  return clauses.reduce((acc, clause) => {
    if (!acc[clause.category]) acc[clause.category] = [];
    acc[clause.category].push(clause);
    return acc;
  }, {} as Record<string, Clause[]>);
}
