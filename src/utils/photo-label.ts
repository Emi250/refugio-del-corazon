import type { Lang } from '~/i18n';

/** Short labels for thumbnails; detailed captions remain in alt text and the viewer. */
export function photoLabel(src: string, lang: Lang): string {
  const name = src.split('/').pop() ?? '';
  const labels: [RegExp, string, string][] = [
    [/dormitorio/, 'Dormitorio', 'Bedroom'], [/cocina/, 'Cocina', 'Kitchen'],
    [/living/, 'Living', 'Living room'], [/bano/, 'Baño', 'Bathroom'],
    [/lavadero/, 'Lavadero', 'Laundry'], [/parrilla/, 'Parrilla', 'Grill'],
    [/parque|jardin/, 'Parque', 'Garden'],
    [/fachada|exterior/, 'Exterior', 'Exterior'], [/ropa-de-cama/, 'Ropa de cama', 'Bed linen'],
  ];
  const match = labels.find(([pattern]) => pattern.test(name));
  return match ? match[lang === 'es' ? 1 : 2] : lang === 'es' ? 'Vista general' : 'Overview';
}
