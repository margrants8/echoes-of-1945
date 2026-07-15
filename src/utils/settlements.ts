export type ClauseStatus = 'executed' | 'partial' | 'not-executed' | 'disputed';

export interface Clause {
  id: string;
  category: string;
  label: string;
  status: ClauseStatus;
  executedYear: number | null;
  reversedAt?: number | null;
  disputed: boolean;
  complianceScore: number;
  note: string;
  sources?: { title: string }[];
}

export interface SettlementData {
  country: string;
  displayName: string;
  treaty: string;
  occupationEnd: string;
  sovereigntyRestored: string;
  overallCompliance: number;
  clauses: Clause[];
}

export const statusLabel: Record<ClauseStatus, string> = {
  executed: '已执行',
  partial: '部分执行',
  'not-executed': '未执行',
  disputed: '存在争议',
};

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

export const categoryLabel: Record<string, string> = {
  territorial: '领土',
  military: '军事',
  reparations: '赔偿',
  judicial: '司法清算',
};
