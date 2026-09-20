import { getImage } from 'astro:assets';
import fachada from '~/assets/images/espacios/fachada.jpg';

/** 1200×630 JPEG < 300 KB: lo que WhatsApp y Facebook necesitan para renderizar el preview. */
export async function ogVariant(img: ImageMetadata): Promise<string> {
  const out = await getImage({
    src: img,
    width: 1200,
    height: 630,
    fit: 'cover',
    position: 'attention',
    format: 'jpeg',
    quality: 76,
  });
  return out.src;
}

/** Fuentes del lightbox. `sm` existe para no bajar 1800px en un telefono:
 *  a 1100px la misma foto pesa ~1/3 y en pantalla no se distingue. */
export interface LightboxSource { lg: string; sm: string }

export async function lightboxVariant(img: ImageMetadata): Promise<LightboxSource> {
  const [lg, sm] = await Promise.all([
    getImage({ src: img, width: 1800, format: 'webp', quality: 80 }),
    getImage({ src: img, width: 1100, format: 'webp', quality: 78 }),
  ]);
  return { lg: lg.src, sm: sm.src };
}

export async function lightboxVariants(
  images: { src: ImageMetadata; caption?: string }[],
): Promise<LightboxSource[]> {
  return Promise.all(images.map(i => lightboxVariant(i.src)));
}

/** Fondo del hero. Es la fachada y no un paisaje generico: quien abre el link
 *  viene a elegir un departamento, no a ver el cerro. Pasa por astro:assets
 *  (antes se servia un JPG sin optimizar desde public/, y era el LCP del home). */
export async function heroBackground(): Promise<string> {
  const out = await getImage({ src: fachada, width: 2000, format: 'webp', quality: 74 });
  return out.src;
}
