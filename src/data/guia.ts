import type { Lang } from '~/i18n';

type Text = Record<Lang, string>;

export interface GuidePlace {
  name: Text;
  kind: Text;
  distance: Text;
  note: Text;
  mapsQuery: string;
}

export interface GuideGroup {
  id: string;
  title: Text;
  meta: Text;
  places: GuidePlace[];
}

export const GUIA_PATH = '/que-hacer-en-capilla-del-monte';

/** Las distancias de los lugares que también figuran en Ubicación son las mismas
 *  de `src/content/near/*.json` y `src/pages/en/ubicacion.astro`: si cambian allá,
 *  cambiarlas acá. */
export const GUIDE_GROUPS: GuideGroup[] = [
  {
    id: 'a-pie',
    title: { es: 'En el pueblo, a pie', en: 'In town, on foot' },
    meta: { es: 'A 10 MIN DEL REFUGIO', en: '10 MIN FROM THE REFUGIO' },
    places: [
      {
        name: { es: 'Peatonal techada y Plaza San Martín', en: 'Covered pedestrian street & Plaza San Martín' },
        kind: { es: 'Paseo', en: 'Stroll' },
        distance: { es: '800 m · 10 min a pie', en: '800 m · 10 min walk' },
        note: {
          es: 'El centro del pueblo: una calle techada con locales y cafés, y el paseo de artesanos alrededor de la plaza. Un buen plan para la tarde, o para un día nublado.',
          en: 'The heart of town: a covered street lined with shops and cafés, and the artisan walk around the square. A good plan for the afternoon, or for a cloudy day.',
        },
        mapsQuery: 'Peatonal techada y Plaza San Martín',
      },
      {
        name: { es: 'Valpisa Pizzería', en: 'Valpisa Pizzería' },
        kind: { es: 'Gastronomía', en: 'Food' },
        distance: { es: '700 m · 10 min a pie', en: '700 m · 10 min walk' },
        note: {
          es: 'Horno a leña a la vista: la pizza referente del pueblo. Para cenar sin sacar el auto después de un día de sierras.',
          en: 'Wood-fired oven in full view: the town’s go-to pizza. Dinner without taking the car after a day in the hills.',
        },
        mapsQuery: 'Valpisa Pizzería',
      },
      {
        name: { es: 'City Bar', en: 'City Bar' },
        kind: { es: 'Café', en: 'Café' },
        distance: { es: '800 m · 10 min a pie', en: '800 m · 10 min walk' },
        note: {
          es: 'Café, tortas y comidas en plena peatonal techada. Buena pausa en la vuelta por el centro.',
          en: 'Coffee, cakes and meals right on the covered street. A good break while walking around town.',
        },
        mapsQuery: 'City Bar',
      },
    ],
  },
  {
    id: 'naturaleza',
    title: { es: 'Naturaleza a minutos', en: 'Nature minutes away' },
    meta: { es: 'MENOS DE 15 MIN EN AUTO', en: 'UNDER 15 MIN BY CAR' },
    places: [
      {
        name: { es: 'Cerro Uritorco', en: 'Cerro Uritorco' },
        kind: { es: 'Trekking', en: 'Trekking' },
        distance: { es: '2,3 km · 5 min en auto', en: '2.3 km · 5 min drive' },
        note: {
          es: 'El cerro más alto de las Sierras Chicas y el símbolo de Capilla. El sendero sale del balneario La Toma: unos 6 km de dificultad media-alta y entre 3 y 4 horas hasta la cumbre. El ingreso es pago y hay que anotarse en una planilla antes de subir.',
          en: 'The highest peak of the Sierras Chicas and the symbol of Capilla. The trail starts at La Toma: about 6 km, moderately hard, 3 to 4 hours to the summit. There is an entrance fee and you sign a register before heading up.',
        },
        mapsQuery: 'Cerro Uritorco',
      },
      {
        name: { es: 'Balneario La Toma · Río Calabalumba', en: 'La Toma · Río Calabalumba' },
        kind: { es: 'Río', en: 'River' },
        distance: { es: '2,3 km · 5 min en auto', en: '2.3 km · 5 min drive' },
        note: {
          es: 'Cascadas y piletas naturales sobre el Calabalumba, al pie del Uritorco. En verano, el balneario más cercano para pasar el día.',
          en: 'Waterfalls and natural pools on the Calabalumba, at the foot of the Uritorco. In summer, the closest river spot to spend the day.',
        },
        mapsQuery: 'Balneario La Toma',
      },
      {
        name: { es: 'Dique El Cajón y El Zapato', en: 'Dique El Cajón & El Zapato' },
        kind: { es: 'Mirador', en: 'Viewpoint' },
        distance: { es: '2,2 km · 5 min en auto', en: '2.2 km · 5 min drive' },
        note: {
          es: 'Mirador natural sobre el dique, con El Zapato, la piedra que le da nombre. El lugar para ver el atardecer sobre el agua.',
          en: 'A natural overlook above the reservoir, with El Zapato, the rock it is named after. The place to watch the sunset over the water.',
        },
        mapsQuery: 'Dique El Cajón',
      },
      {
        name: { es: 'Los Mogotes', en: 'Los Mogotes' },
        kind: { es: 'Paisaje', en: 'Landscape' },
        distance: { es: '4,3 km · 13 min en auto', en: '4.3 km · 13 min drive' },
        note: {
          es: 'Formaciones de granito redondeadas a orillas del Río Dolores. Para caminar entre las rocas y, en verano, refrescarse en el río.',
          en: 'Rounded granite formations along the Río Dolores. Walk among the rocks and, in summer, cool off in the river.',
        },
        mapsQuery: 'Los Mogotes',
      },
    ],
  },
  {
    id: 'excursiones',
    title: { es: 'Excursiones de medio día', en: 'Half-day trips' },
    meta: { es: 'EN AUTO', en: 'BY CAR' },
    places: [
      {
        name: { es: 'Parque Los Terrones', en: 'Los Terrones Park' },
        kind: { es: 'Parque natural', en: 'Nature park' },
        distance: { es: '14 km · 25 min en auto', en: '14 km · 25 min drive' },
        note: {
          es: 'Formaciones rocosas rojizas que se recorren por senderos: El Sillón, el Dedo de Dios, el Rostro del Indio. El ingreso es pago; calculá unas horas para recorrerlo sin apuro.',
          en: 'Reddish rock formations along marked trails: The Armchair, Finger of God, Indian Face. There is an entrance fee; allow a few hours to walk it unhurried.',
        },
        mapsQuery: 'Parque Los Terrones',
      },
      {
        name: { es: 'Valle de Ongamira', en: 'Ongamira Valley' },
        kind: { es: 'Valle', en: 'Valley' },
        distance: { es: '25 km aprox. · tramo de ripio', en: 'approx. 25 km · partly gravel road' },
        note: {
          es: 'Un valle de paredones rojizos con las Grutas de Ongamira, de acceso pago, y el ascenso al Cerro Colchiquí, de unas tres horas. Se combina bien con Los Terrones en el mismo día.',
          en: 'A valley of reddish cliffs with the Ongamira caves, which charge an entrance fee, and the climb to Cerro Colchiquí, about three hours. Pairs well with Los Terrones on the same day.',
        },
        mapsQuery: 'Grutas de Ongamira',
      },
      {
        name: { es: 'La Tramontana', en: 'La Tramontana' },
        kind: { es: 'Gastronomía', en: 'Food' },
        distance: { es: '13 km · 23 min en auto', en: '13 km · 23 min drive' },
        note: {
          es: 'Restaurante de cocina argentina fuera del pueblo, para una comida larga y sin apuro.',
          en: 'Argentine restaurant outside town, for a long, unhurried meal.',
        },
        mapsQuery: 'La Tramontana',
      },
    ],
  },
];

export const GUIDE_SEASONS: { title: Text; body: Text }[] = [
  {
    title: { es: 'Verano', en: 'Summer' },
    body: {
      es: 'Los ríos son el plan: La Toma, el Calabalumba y Los Mogotes. Caminá temprano y dejá el río para el mediodía.',
      en: 'Rivers are the plan: La Toma, the Calabalumba and Los Mogotes. Hike early and save the river for midday.',
    },
  },
  {
    title: { es: 'Otoño e invierno', en: 'Autumn & winter' },
    body: {
      es: 'Días secos y templados, ideales para subir el Uritorco o recorrer Los Terrones sin calor. Cuando baja el sol refresca rápido: llevá abrigo.',
      en: 'Dry, mild days, ideal for climbing the Uritorco or walking Los Terrones without the heat. It cools down fast after sunset: bring a jacket.',
    },
  },
  {
    title: { es: 'De noche', en: 'At night' },
    body: {
      es: 'Capilla es famosa por los avistajes OVNI alrededor del Uritorco. Leyenda o no, lejos de las luces del centro el cielo de las sierras se ve muy bien.',
      en: 'Capilla is famous for UFO sightings around the Uritorco. Legend or not, away from the town lights the mountain sky is spectacular.',
    },
  },
];

export const GUIDE_WEEKEND: { title: Text; steps: Text[] }[] = [
  {
    title: { es: 'Día 1 · Uritorco y río', en: 'Day 1 · Uritorco & river' },
    steps: [
      { es: 'Mañana: subida al Uritorco, saliendo temprano desde La Toma.', en: 'Morning: climb the Uritorco, starting early from La Toma.' },
      { es: 'Tarde: descanso en las piletas naturales del Calabalumba.', en: 'Afternoon: rest at the Calabalumba natural pools.' },
      { es: 'Noche: pizza a la leña a 10 minutos a pie.', en: 'Evening: wood-fired pizza a 10-minute walk away.' },
    ],
  },
  {
    title: { es: 'Día 2 · Rocas y valle', en: 'Day 2 · Rocks & valley' },
    steps: [
      { es: 'Mañana: Parque Los Terrones.', en: 'Morning: Los Terrones Park.' },
      { es: 'Mediodía: Valle de Ongamira y sus grutas.', en: 'Midday: Ongamira Valley and its caves.' },
      { es: 'Atardecer: El Zapato, sobre el Dique El Cajón.', en: 'Sunset: El Zapato, above Dique El Cajón.' },
    ],
  },
];

export const GUIDE_TIPS: Text[] = [
  {
    es: 'Llevá agua, protector solar y calzado cómodo: en los senderos casi no hay sombra ni dónde comprar.',
    en: 'Bring water, sunscreen and good shoes: trails have little shade and nowhere to buy supplies.',
  },
  {
    es: 'Al Uritorco salí temprano. En verano, evitá subir en las horas de más calor.',
    en: 'Start the Uritorco early. In summer, avoid climbing in the hottest hours.',
  },
  {
    es: 'Si hay tormenta, salí del río y alejate de la orilla: las crecidas llegan rápido.',
    en: 'If a storm comes, get out of the river and away from the bank: flash floods arrive fast.',
  },
  {
    es: 'El Uritorco, Los Terrones y las Grutas de Ongamira tienen ingreso pago: consultá horarios antes de ir.',
    en: 'The Uritorco, Los Terrones and the Ongamira caves charge entrance fees: check opening hours before you go.',
  },
  {
    es: 'Preguntanos al llegar: te contamos cómo está el río y qué conviene según el día.',
    en: 'Ask us when you arrive: we’ll tell you how the river is and what suits the day.',
  },
];
