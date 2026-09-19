import patio from '~/assets/images/espacios/patio.jpg';
import parrilla from '~/assets/images/espacios/parrilla.jpg';
import fachada from '~/assets/images/espacios/fachada.jpg';
import jardin from '~/assets/images/espacios/jardin.jpg';
import rosa from '~/assets/images/espacios/rosa.jpg';
import lateralCerro from '~/assets/images/espacios/lateral-cerro.jpg';
import frenteJardin from '~/assets/images/espacios/frente-jardin.jpg';
import pasoMediasombra from '~/assets/images/espacios/paso-mediasombra.jpg';
import jazmin from '~/assets/images/espacios/jazmin.jpg';
import accesoPorton from '~/assets/images/espacios/acceso-porton.jpg';
import rosaLateral from '~/assets/images/espacios/rosa-lateral.jpg';
import pasoLateral from '~/assets/images/espacios/paso-lateral.jpg';
import { t, type Lang } from '~/i18n';

/** Las cinco primeras son las celdas visibles del mosaico; el resto viaja oculto para el lightbox. */
export const ESPACIOS = [
  { src: patio, key: 'patio' },
  { src: parrilla, key: 'parrilla' },
  { src: fachada, key: 'fachada' },
  { src: jardin, key: 'jardin' },
  { src: rosa, key: 'rosa' },
  { src: lateralCerro, key: 'lateralCerro' },
  { src: frenteJardin, key: 'frenteJardin' },
  { src: pasoMediasombra, key: 'pasoMediasombra' },
  { src: jazmin, key: 'jazmin' },
  { src: accesoPorton, key: 'accesoPorton' },
  { src: rosaLateral, key: 'rosaLateral' },
  { src: pasoLateral, key: 'pasoLateral' },
] as const;

export const ESPACIOS_ANCHOR = 'espacios-comunes';
export const ESPACIOS_GROUP = 'espacios';

export function espaciosImages(lang: Lang) {
  return ESPACIOS.map(({ src, key }) => ({
    src,
    caption: t(`spaces.captions.${key}`, lang),
  }));
}
