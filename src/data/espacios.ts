import patio from '~/assets/images/espacios/patio.jpg';
import parrilla from '~/assets/images/espacios/parrilla.jpg';
import fachada from '~/assets/images/espacios/fachada.jpg';
import jardin from '~/assets/images/espacios/jardin.jpg';
import frenteJardin from '~/assets/images/espacios/frente-jardin.jpg';
import lateralCerro from '~/assets/images/espacios/lateral-cerro.jpg';
import pasoMediasombra from '~/assets/images/espacios/paso-mediasombra.jpg';
import accesoPorton from '~/assets/images/espacios/acceso-porton.jpg';
import jazmin from '~/assets/images/espacios/jazmin.jpg';
import { t, type Lang } from '~/i18n';

/** Las cinco primeras son las celdas visibles del mosaico; el resto viaja oculto
 *  para el lightbox. Se dieron de baja `rosa` y `rosa-lateral` (era la misma rosa
 *  desde un paso mas cerca) y `paso-lateral` (pasto pelado y los tanques del vecino). */
export const ESPACIOS = [
  { src: patio, key: 'patio' },
  { src: parrilla, key: 'parrilla' },
  { src: fachada, key: 'fachada' },
  { src: jardin, key: 'jardin' },
  { src: frenteJardin, key: 'frenteJardin' },
  { src: lateralCerro, key: 'lateralCerro' },
  { src: pasoMediasombra, key: 'pasoMediasombra' },
  { src: accesoPorton, key: 'accesoPorton' },
  { src: jazmin, key: 'jazmin' },
] as const;

export const ESPACIOS_ANCHOR = 'espacios-comunes';
export const ESPACIOS_GROUP = 'espacios';

export function espaciosImages(lang: Lang) {
  return ESPACIOS.map(({ src, key }) => ({
    src,
    caption: t(`spaces.captions.${key}`, lang),
  }));
}
