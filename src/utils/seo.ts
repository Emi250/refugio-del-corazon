import type { Lang } from '~/i18n';

export const SITE_URL = 'https://refugiodelcorazon.com.ar';
export const SITE_NAME = 'El Refugio del Corazón';
export const DEFAULT_OG_IMAGE = '/og/default.jpg';

export const BUSINESS = {
  name: SITE_NAME,
  legalName: 'El Refugio del Corazón',
  street: 'Río Negro 64',
  locality: 'Capilla del Monte',
  region: 'Córdoba',
  regionCode: 'AR-X',
  postalCode: 'X5184',
  country: 'AR',
  countryName: 'Argentina',
  // Pin de la ficha de Google Maps, confirmado por el propietario el 2026-10-05.
  latitude: -30.8659207,
  longitude: -64.5248283,
  priceRange: '$$',
  whatsapp: (import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '5493548000000').replace(/\D/g, ''),
  bookingUrl: 'https://www.booking.com/hotel/ar/hospedaje-depto-tranquilo-en-capilla-del-monte.html',
  mapsUrl: 'https://maps.app.goo.gl/Zs3MGBP1naMxwqmt5',
};

export const MAP_EMBED_URL = `https://www.google.com/maps?q=${BUSINESS.latitude},${BUSINESS.longitude}&z=17&output=embed`;

export function directionsUrl(origin?: string): string {
  const url = new URL('https://www.google.com/maps/dir/');
  url.searchParams.set('api', '1');
  url.searchParams.set('destination', `${BUSINESS.latitude},${BUSINESS.longitude}`);
  if (origin) {
    url.searchParams.set('origin', origin);
    url.searchParams.set('travelmode', 'driving');
  }
  return url.toString();
}

function ensureTrailingSlash(p: string): string {
  if (p === '/' || p === '') return '/';
  return p.endsWith('/') ? p : `${p}/`;
}

/** URL absoluta para páginas (con trailing slash). */
export function absoluteUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  const [, route, suffix = ''] = clean.match(/^([^#?]*)(.*)$/)!;
  return `${SITE_URL}${ensureTrailingSlash(route)}${suffix}`;
}

/** URL absoluta para assets estáticos (sin trailing slash). */
export function absoluteAssetUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}

export function getCanonical(pathname: string): string {
  return absoluteUrl(pathname || '/');
}

/** Para cada ruta devuelve la URL hermana ES/EN para hreflang. */
export function getAlternates(pathname: string): { es: string; en: string } {
  const path = ensureTrailingSlash(pathname || '/');
  if (path === '/en/') {
    return { es: absoluteUrl('/'), en: absoluteUrl('/en/') };
  }
  if (path.startsWith('/en/')) {
    const rest = path.slice(3) || '/';
    return { es: absoluteUrl(rest), en: absoluteUrl(path) };
  }
  return { es: absoluteUrl(path), en: absoluteUrl(`/en${path}`) };
}

export function getOgLocale(lang: Lang): string {
  return lang === 'es' ? 'es_AR' : 'en_US';
}

export function getOgImage(image?: string): string {
  return absoluteAssetUrl(image ?? DEFAULT_OG_IMAGE);
}
