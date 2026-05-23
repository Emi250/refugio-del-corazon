import { defineCollection, z } from 'astro:content';

const unidades = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    name_en: z.string().optional(),
    order: z.number(),
    lang: z.enum(['es', 'en']).default('es'),
    specs: z.object({
      capacidad: z.string(),
      ambientes: z.string(),
      metros: z.string(),
      vista: z.string().optional(),
    }),
    chips: z.array(z.string()),
    hero_image: z.string(),
    gallery: z.array(z.object({
      src: z.string(),
      caption: z.string().optional(),
    })),
    blurb: z.string(),
    blurb_en: z.string().optional(),
  }),
});

const faq = defineCollection({
  type: 'content',
  schema: z.object({
    category: z.string(),
    category_en: z.string().optional(),
    order: z.number(),
    lang: z.enum(['es', 'en']).default('es'),
    qa: z.array(z.object({
      q: z.string(),
      a: z.string(),
    })),
  }),
});

const near = defineCollection({
  type: 'data',
  schema: z.object({
    category: z.string(),
    items: z.array(z.object({
      name: z.string(),
      note: z.string().optional(),
      distance: z.string(),
    })),
  }),
});

export const collections = { unidades, faq, near };
