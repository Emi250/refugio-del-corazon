import { getImage } from 'astro:assets';

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

/** Versión grande para el lightbox: se descarga solo al hacer clic. */
export async function lightboxVariant(img: ImageMetadata): Promise<string> {
  const out = await getImage({ src: img, width: 1800, format: 'webp', quality: 80 });
  return out.src;
}

export async function lightboxVariants(
  images: { src: ImageMetadata; caption?: string }[],
): Promise<string[]> {
  return Promise.all(images.map(i => lightboxVariant(i.src)));
}
