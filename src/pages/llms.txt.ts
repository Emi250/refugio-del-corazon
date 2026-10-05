import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { BUSINESS, SITE_NAME, SITE_URL, absoluteUrl } from '~/utils/seo';

export const GET: APIRoute = async () => {
  const units = (await getCollection('unidades', ({ data }) => data.lang === 'es'))
    .sort((a, b) => a.data.order - b.data.order);
  const faq = (await getCollection('faq', ({ data }) => data.lang === 'es'))
    .sort((a, b) => a.data.order - b.data.order);
  const text = [
    `# ${SITE_NAME}`,
    '> Departamentos de alquiler temporario en Capilla del Monte, Córdoba, Argentina.',
    `Dirección: ${BUSINESS.street}, ${BUSINESS.locality}, ${BUSINESS.region}, ${BUSINESS.countryName}.`,
    `Sitio oficial: ${SITE_URL}/`,
    `Ubicación: ${BUSINESS.mapsUrl}`,
    '## Departamentos',
    ...units.map(({ slug, data }) => [
      `### ${data.name}`,
      `${data.specs.capacidad}. ${data.specs.ambientes}. ${data.specs.metros}.`,
      data.blurb,
      `Equipamiento: ${data.chips.join(', ')}.`,
      `Ficha: ${absoluteUrl(`/unidades/${slug}`)}`,
    ].join('\n\n')),
    '## Reservas y condiciones',
    'Consultas de tarifas y disponibilidad por WhatsApp. La reserva se coordina directamente con el alojamiento.',
    ...faq.flatMap(group => group.data.qa.map(({ q, a }) => `### ${q}\n\n${a}`)),
    '## Más información',
    ...[
      ['Galería', '/galeria/'], ['Servicios', '/servicios/'],
      ['Ubicación', '/ubicacion/'], ['Preguntas frecuentes', '/faq/'], ['English', '/en/'],
    ].map(([label, path]) => `- [${label}](${absoluteUrl(path)})`),
  ].join('\n\n');
  return new Response(text + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
