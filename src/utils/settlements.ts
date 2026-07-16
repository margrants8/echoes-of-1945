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

export interface SettlementData {
  country: string;
  displayName: LocalizedText;
  treaty: LocalizedText;
  occupationEnd: string;
  sovereigntyRestored: string;
  overallCompliance: number;
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

export function groupByCategory(clauses: Clause[]): Record<string, Clause[]> {
  return clauses.reduce((acc, clause) => {
    if (!acc[clause.category]) acc[clause.category] = [];
    acc[clause.category].push(clause);
    return acc;
  }, {} as Record<string, Clause[]>);
}
