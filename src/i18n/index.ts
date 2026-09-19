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

/** Igual que t(), pero para las claves que guardan una lista (ej. spaces.chips). */
export function tList(key: string, lang: Lang = 'es'): string[] {
  const parts = key.split('.');
  let node: any = dict[lang];
  for (const p of parts) {
    if (node == null) return [];
    node = node[p];
  }
  return Array.isArray(node) ? node : [];
}

export function detectLang(pathname: string): Lang {
  return pathname.startsWith('/en') ? 'en' : 'es';
}

/** El sitio usa trailingSlash: 'always'. Sin la barra, cada link interno paga un 308. */
export function withTrailingSlash(path: string): string {
  const [base, hash] = path.split('#');
  const frag = hash === undefined ? '' : `#${hash}`;
  if (!base || base === '/') return `/${frag}`;
  return base.endsWith('/') ? `${base}${frag}` : `${base}/${frag}`;
}

export function localizedPath(path: string, lang: Lang): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  const full = lang === 'es' ? clean : `/en${clean === '/' ? '' : clean}`;
  return withTrailingSlash(full);
}

/** La ruta hermana en el otro idioma, para el toggle y el banner. */
export function otherLangPath(pathname: string, lang: Lang): string {
  const other = lang === 'es'
    ? `/en${pathname === '/' ? '' : pathname}`
    : pathname.replace(/^\/en/, '') || '/';
  return withTrailingSlash(other);
}
