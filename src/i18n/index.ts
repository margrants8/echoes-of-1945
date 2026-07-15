import { translations, type Lang } from './translations';

const BASE = '/echoes-of-1945';

export function getLang(url: URL): Lang {
  const pathname = url.pathname;
  const withoutBase = pathname.startsWith(BASE)
    ? pathname.slice(BASE.length)
    : pathname;
  return withoutBase.startsWith('/zh') ? 'zh' : 'en';
}

export function useTranslations(lang: Lang) {
  return translations[lang];
}

export function localePath(path: string, lang: Lang): string {
  if (lang === 'en') return `${BASE}${path}`;
  return `${BASE}/zh${path}`;
}

export function pathWithoutLocale(url: URL): string {
  const pathname = url.pathname;
  const withoutBase = pathname.startsWith(BASE)
    ? pathname.slice(BASE.length)
    : pathname;
  if (withoutBase.startsWith('/zh')) {
    return withoutBase.slice(3) || '/';
  }
  return withoutBase || '/';
}

export type { Lang };
