import type { Lang } from '~/i18n';

export const SITE_URL = 'https://refugiodelcorazon.com.ar';
export const SITE_NAME = 'Refugio del Corazón';
export const DEFAULT_OG_IMAGE = '/cerro%20uritorco.jpg';

export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'Refugio del Corazón',
  street: 'Río Negro 64',
  locality: 'Capilla del Monte',
  region: 'Córdoba',
  regionCode: 'AR-X',
  postalCode: 'X5184',
  country: 'AR',
  countryName: 'Argentina',
  latitude: -30.8652362,
  longitude: -64.5283123,
  priceRange: '$$',
  whatsapp: import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '5493548000000',
  bookingUrl: 'https://www.booking.com/hotel/ar/refugio-del-corazon.html',
  mapsUrl: 'https://maps.app.goo.gl/Zs3MGBP1naMxwqmt5',
};

function stripTrailingSlash(p: string): string {
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${stripTrailingSlash(clean)}`;
}

export function getCanonical(pathname: string): string {
  return absoluteUrl(stripTrailingSlash(pathname || '/'));
}

/** Para cada ruta devuelve la URL hermana ES/EN para hreflang. */
export function getAlternates(pathname: string): { es: string; en: string } {
  const path = stripTrailingSlash(pathname || '/');
  if (path === '/en' || path === '/en/') {
    return { es: absoluteUrl('/'), en: absoluteUrl('/en') };
  }
  if (path.startsWith('/en/')) {
    const rest = path.slice(3);
    return { es: absoluteUrl(rest), en: absoluteUrl(path) };
  }
  return { es: absoluteUrl(path), en: absoluteUrl(`/en${path === '/' ? '' : path}`) };
}

export function getOgLocale(lang: Lang): string {
  return lang === 'es' ? 'es_AR' : 'en_US';
}

export function getOgImage(image?: string): string {
  return absoluteUrl(image ?? DEFAULT_OG_IMAGE);
}
