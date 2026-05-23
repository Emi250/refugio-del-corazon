import es from './es.json';
import en from './en.json';

export type Lang = 'es' | 'en';

const dict = { es, en } as const;

export function t(key: string, lang: Lang = 'es'): string {
  const parts = key.split('.');
  let node: any = dict[lang];
  for (const p of parts) {
    if (node == null) return key;
    node = node[p];
  }
  return typeof node === 'string' ? node : key;
}

export function detectLang(pathname: string): Lang {
  return pathname.startsWith('/en') ? 'en' : 'es';
}

export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (lang === 'es') return clean;
  return `/en${clean === '/' ? '' : clean}`;
}
