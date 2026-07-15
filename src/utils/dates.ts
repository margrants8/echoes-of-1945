export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

export function dateRange(start: string, end?: string): string {
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getFullYear() === e.getFullYear()) {
    return `${s.getFullYear()}年`;
  }
  return `${s.getFullYear()}—${e.getFullYear()}年`;
}
