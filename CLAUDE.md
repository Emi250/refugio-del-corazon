# CLAUDE.md — Refugio del Corazón

Guía de proyecto para sesiones futuras de Claude Code. Léeme **completo** antes de tocar archivos. Diseñado para que NO necesites releer los bocetos mid-fi en la mayoría de tareas.

---

## 1. Project Overview

**Producto**: Sitio web estático para promocionar 4 unidades de alquiler temporario en un mismo edificio.

- **Negocio**: Refugio del Corazón
- **Ubicación**: Rio Negro 64, Capilla del Monte, Córdoba, Argentina
- **Target**: turistas argentinos (principalmente) e internacionales (secundario)
- **Sitio actual a reemplazar**: https://refugio-del-corazon.lovable.app/ (Lovable, simple)
- **Objetivo del nuevo sitio**: generar consultas directas por WhatsApp, reducir preguntas repetitivas, mostrar la calidad del alojamiento con una estética premium editorial-industrial-nórdica.

**Restricciones del producto (NO IMPLEMENTAR)**:
- ❌ Sin calendario de disponibilidad
- ❌ Sin pagos online
- ❌ Sin reservas automáticas
- ❌ Sin cuentas de usuario
- ✅ Solo consultas vía WhatsApp

---

## 2. Tech Stack

| Capa | Tecnología | Notas |
|---|---|---|
| Framework | **Astro** (≥ 4.x) | SSG puro, mínimo JS al cliente |
| Estilos | **Tailwind CSS** + CSS vars | Tokens en `tokens.css`, utilidades Tailwind para layout |
| i18n | `astro-i18n` o routing nativo Astro | ES default en `/`, EN en `/en/` |
| Contenido | **Content Collections** de Astro | Unidades, FAQ, lugares cercanos como `.md` |
| Hosting | **Vercel** | Adapter `@astrojs/vercel/static` |
| Package manager | `pnpm` (preferido) o `npm` | |
| Node | ≥ 18.17 | |

**Filosofía**: máximo HTML estático, JS solo donde sea imprescindible (toggle idioma, menú mobile, accordeon FAQ usa `<details>` nativo).

---

## 3. Commands

```bash
pnpm install            # primera vez
pnpm dev                # dev server en localhost:4321
pnpm build              # build a /dist
pnpm preview            # previsualizar build local
pnpm astro check        # type check
```

---

## 4. Architecture

### Rutas

```
/                       Home (ES)
/unidades/[slug]        Detalle de unidad (4 slugs: unidad-1, unidad-2, unidad-3, unidad-4 — renombrar a slugs reales cuando se definan)
/servicios              Servicios completos + "lo que no tenemos"
/ubicacion              Mapa, cómo llegar, qué hay cerca, clima por estación
/faq                    FAQ completa con sidebar de categorías
/galeria                Galería full-screen (página dedicada, NO modal)
/en/                    Home (EN)
/en/units/[slug]        Detalle EN
... resto del espejo en /en/
```

### Estructura de carpetas

```
src/
├── styles/
│   ├── tokens.css       Variables CSS del sistema de diseño (sección 5)
│   └── global.css       Reset + base + utilidades custom
├── content/
│   ├── config.ts        Schemas Zod de collections
│   ├── unidades/        1 .md por unidad (ES) + /en/ para inglés
│   ├── faq/             FAQ agrupadas por categoría
│   └── near/            Lugares cercanos (opcional)
├── i18n/
│   ├── es.json          Strings UI ES
│   └── en.json          Strings UI EN
├── components/          (sección 6)
├── layouts/
│   └── Base.astro       Layout raíz con <head>, fuentes, nav, footer
└── pages/               Una por ruta
```

### i18n strategy

- Strings de UI → JSON en `src/i18n/`, helper `t(key, lang)` en `src/i18n/index.ts`
- Contenido largo (unidades, FAQ) → un `.md` por idioma en sus collections
- Toggle de idioma en NavBar y Hero, persiste en URL (no en localStorage)

---

## 5. Design System

> **Estética**: editorial · industrial · nórdico-cálido. Hairlines de 1px, sombras hard tipo riso `4px 6px 0 ink`, números display gigantes (font-weight 800, letter-spacing -0.045em), mucho espacio negativo, paleta paper+ink+terracotta.

### 5.1 Tokens — `src/styles/tokens.css`

```css
:root {
  /* Paleta core */
  --mf-paper:    #F4F0E6;
  --mf-paper-2:  #E8E2D0;
  --mf-stone:    #C9C0AC;
  --mf-ink:      #1B1A16;
  --mf-ink-soft: #6B6357;
  --mf-hair:     rgba(27, 26, 22, 0.14);
  --mf-accent:   oklch(0.61 0.14 38);   /* terracotta */

  /* Shadows */
  --mf-shadow-hard:  4px 6px 0 rgba(27, 26, 22, 0.85);
  --mf-shadow-card:  6px 6px 0 var(--mf-ink);
  --mf-shadow-cta:   0 6px 24px rgba(0, 0, 0, 0.25);

  /* Type */
  --mf-font-ui:    "Inter", ui-sans-serif, system-ui, sans-serif;
  --mf-font-mono:  "JetBrains Mono", ui-monospace, monospace;
}

[data-palette="olive"]  { --mf-accent: oklch(0.56 0.10 122); }
[data-palette="indigo"] { --mf-accent: oklch(0.46 0.13 270); }
[data-palette="ink"]    { --mf-accent: #1B1A16; }
```

**No reinterpretes estos valores. Copiar literal.**

### 5.2 Tipografía

Cargar de Google Fonts en `<head>` del layout base:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

**Escala**:

| Uso | Familia | Tamaño | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero headline | Inter | `clamp(72px, 9.2vw, 156px)` | 800 | -0.045em |
| Big header (páginas internas) | Inter | `clamp(72px, 8.5vw, 128px)` | 800 | -0.045em |
| Section number | Inter | 56-96px | 800 | -0.04em |
| H2 grande | Inter | 38-48px | 700 | -0.025em |
| H3 / section title | Inter | 24-28px | 700 | -0.025em |
| Body | Inter | 14-16px | 400 | -0.005em |
| Kicker / meta | JetBrains Mono | 10.5-11px | 500 | .14em uppercase |
| Spec mono | JetBrains Mono | 11-13px | 500 | .06-.10em uppercase |

**Líneas base**: line-height de displays = `0.86-0.92`. Body = `1.5-1.6`.

### 5.3 Espaciado y layout

- Container max-width: `1280px` (frame desktop), padding lateral 28px desktop / 18px mobile
- Section padding vertical: 24-30px en bar headers, 60-80px en bloques destacados (quote, CTA)
- Gap entre componentes: 0 (hairlines hacen el separador)

### 5.4 Reglas visuales no negociables

1. **Hairlines siempre `1px solid var(--mf-hair)`** entre items en listas/grids.
2. **Bordes de cards/frames `1.5px solid var(--mf-ink)`** — más gruesos, intencionales.
3. **Sombras** solo dos variantes: `--mf-shadow-hard` (frames mid-fi) o `--mf-shadow-card` (location card). Nada de drop-shadows soft genéricos.
4. **Números de sección gigantes** (`font-weight: 800`, tracking apretado) son la firma visual — usarlos en todas las section bars y unit rows.
5. **CTA principal = pill terracotta** con padding `14px 22px`, border-radius `999px`, sombra `--mf-shadow-cta`.
6. **Mobile-first y 100% responsive**. Breakpoint primario: 900px.

### 5.5 Paleta alternativa

El usuario puede testear `data-palette="olive|indigo|ink"` en `<html>`. Mantener todos los componentes usando `var(--mf-accent)` para que el swap funcione.

---

## 6. Components

Cada componente vive en `src/components/[Nombre].astro`. Props con TypeScript. Slots para contenido HTML.

| Componente | Responsabilidad | Notas clave |
|---|---|---|
| `BrandMark.astro` | Círculo 36px con inicial "R", border ink | Variantes: paper (default), inverted (en hero/footer) |
| `NavBar.astro` | Barra superior sticky con brand, links, lang toggle, CTA WhatsApp | Versión hero (sobre imagen, texto paper) y versión internas (paper, texto ink) |
| `Hero.astro` | Hero 720px desktop / 600px mobile con bg image, gradient overlay top+bottom, headline gigante, subtítulo, CTA | Acepta `image`, `kicker`, `title`, `subtitle`, `ctaText` |
| `SectionBar.astro` | Barra de sección: número display + título + rule + meta uppercase | Props: `no`, `title`, `meta` |
| `UnitRow.astro` | Fila de unidad en home: foto grande + número 96px + título 38px + spec + blurb + chips + link "Ver más" con underline terracotta | Prop `align: "left" \| "right"` para alternar |
| `PhotoMosaic.astro` | Grid `2fr 1fr 1fr` × 2 rows × 240px en detalle de unidad. Última celda tiene CTA "Ver galería" flotante | Props: `images[]` |
| `EnPocasPalabras.astro` | Card paper-2 con border ink, grid 2×2 de specs (kickers mono + valor) + chips de amenities abajo | Props: `specs[]`, `chips[]` |
| `ServiceList.astro` | Lista de servicios en `column-count: 2` con dot terracotta, key Inter + value Mono uppercase ("INCLUIDO"/"NO INCLUIDO") | Soporta grupos con headers |
| `LocationCard.astro` | Card flotante absoluto sobre mapa: kicker, h3 28px, descripción, chips, footer hairline | Sombra `--mf-shadow-card` |
| `FAQItem.astro` | `<details>` nativo. Summary: número mono + pregunta + toggle `+`. Open rota a `×` | Sin JS |
| `WhatsAppCTA.astro` | Botón pill terracotta. Variantes: inline, big, sticky-mobile | Genera href con mensaje prellenado (sección 9) |
| `Footer.astro` | Fondo ink, brand + tagline, 4 columnas con kickers mono, grid de unidades con hover terracotta, bottom bar mono | |
| `MobileStickyCTA.astro` | Sticky bottom en mobile con WhatsAppCTA fullwidth | Solo `<md:` |
| `ReviewsBlock.astro` | Sección de reseñas en el home con widget Elfsight (Booking) embebido, frame editorial propio (kicker mono + hairlines + bg paper) | Script `platform.js` cargado con `is:inline async`; `min-height` reservado para evitar CLS; footer mono opcional con link al listing de Booking |

### Convención de props

```ts
// Ejemplo SectionBar.astro
interface Props {
  no: string;          // "01"
  title: string;
  meta?: string;       // "FROM $XX/NIGHT" → uppercase auto
  class?: string;
}
```

- Usar `class` prop en todos los componentes para extender estilos.
- Strings que pueden ser i18n → recibirlos como prop, NO hardcodear.
- Imágenes → siempre prop `image: ImageMetadata` para que `astro:assets` optimice.

---

## 7. Content Editing

### Unidades

Cada unidad es un `.md` en `src/content/unidades/[slug].md` (ES) y `src/content/unidades/en/[slug].md` (EN). El slug se deriva automáticamente del nombre del archivo — **NO** lo pongas en el frontmatter (Astro reserva esa key y rompe el build si hay duplicados entre carpetas).

```yaml
---
name: "El Refugio del Cerro"
order: 1
specs:
  capacidad: "2-3 personas"
  ambientes: "1 dormitorio · living"
  metros: "42 m²"
  vista: "Sierras al frente"
chips: ["WiFi", "Cocina equipada", "Calefacción", "Estufa a leña"]
hero_image: "/images/unidades/unidad-1/hero.jpg"
gallery:
  - { src: "/images/unidades/unidad-1/cocina.jpg", caption: "Cocina" }
  - { src: "/images/unidades/unidad-1/living.jpg", caption: "Living" }
---

Texto descriptivo largo en Markdown, párrafos sobre el espacio, la ambientación...
```

### FAQ

`src/content/faq/[categoria].md` con array de `qa` en frontmatter:

```yaml
---
category: "Check-in y check-out"
order: 1
qa:
  - q: "¿A qué hora puedo hacer el check-in?"
    a: "El check-in es de 15:00 a 20:00..."
---
```

### Imágenes

- Carpeta: `public/images/[grupo]/[archivo].jpg`
- Naming: `u1-cocina.jpg`, `u2-balcon.jpg`, `exterior-frente.jpg`
- Formato preferido: AVIF + WebP via `astro:assets`. JPG si la imagen viene de fuera.
- Tamaños: hero ≥ 1920px lado largo. Galería ≥ 1600px. Thumbs ≥ 800px.

---

## 8. i18n

`src/i18n/es.json` y `en.json` con claves namespaced:

```json
{
  "nav": { "units": "Unidades", "services": "Servicios", "location": "Ubicación", "faq": "FAQ", "gallery": "Galería" },
  "hero": { "kicker": "Capilla del Monte, Córdoba", "cta": "Consultar por WhatsApp" },
  "footer": { "tagline": "Tu refugio en las sierras." }
}
```

**Helper** `src/i18n/index.ts`:

```ts
import es from './es.json';
import en from './en.json';
const dict = { es, en };
export function t(key: string, lang: 'es' | 'en' = 'es') {
  return key.split('.').reduce((o, k) => o?.[k], dict[lang]) ?? key;
}
```

**Reglas**:
- Nunca hardcodear texto UI en componentes — siempre pasarlo como prop o usar `t()`.
- Para detectar idioma de la ruta: `const lang = Astro.url.pathname.startsWith('/en') ? 'en' : 'es'`.

---

## 9. WhatsApp Integration

### Configuración

`.env`:
```
PUBLIC_WHATSAPP_NUMBER=5493548XXXXXXX   # con código país, sin +
PUBLIC_GMAPS_EMBED_URL=https://www.google.com/maps/embed?pb=...
```

### Helper

`src/utils/whatsapp.ts`:

```ts
const NUMBER = import.meta.env.PUBLIC_WHATSAPP_NUMBER;

export function waLink(message?: string, lang: 'es' | 'en' = 'es') {
  const defaults = {
    es: 'Hola, quería consultar por una de las unidades.',
    en: "Hi, I'd like to ask about one of your units.",
  };
  const text = encodeURIComponent(message ?? defaults[lang]);
  return `https://wa.me/${NUMBER}?text=${text}`;
}
```

**Uso en componentes**: `<a href={waLink(`Hola, consulto por ${unitName}`)}>...</a>`.

---

## 10. Deployment

**Vercel**:

1. `pnpm add @astrojs/vercel`
2. En `astro.config.mjs`:
   ```js
   import vercel from '@astrojs/vercel/static';
   export default defineConfig({ output: 'static', adapter: vercel() });
   ```
3. Conectar repo a Vercel, definir env vars (`PUBLIC_WHATSAPP_NUMBER`, `PUBLIC_GMAPS_EMBED_URL`).
4. Dominio custom → DNS en el panel del proveedor.

**SEO mínimo**:
- `<title>` y `<meta description>` por página
- `og:image` con foto del exterior
- `sitemap.xml` con `@astrojs/sitemap`
- `robots.txt` permitiendo todo

---

## 11. Referencias visuales (mockups Mid-fi)

Bocetos canónicos en `C:\Users\emili\OneDrive\Escritorio\`:

- `V2 Mid-fi.html` — **Home** completa (desktop + mobile)
- `Detalle Mid-fi.html` — **Detalle de unidad** (desktop + mobile)
- `Páginas internas Mid-fi-print.html` — **Servicios, Ubicación, FAQ**
- `Galería full-screen.html` — **Galería**
- `index.html` — Showcase de wireframes con tabs

**Cuándo leerlos** (sección 12 para detalles): solo si necesitás replicar un componente que NO está descrito acá con suficiente detalle, o si una decisión visual ambigua surge en review.

---

## 12. Token-saving guidelines (LEER)

Este proyecto se optimiza para **mínimo gasto de tokens** por sesión. Reglas:

1. **NO releas los 5 HTML de mockups por defecto.** Este CLAUDE.md ya contiene el sistema completo: tokens, tipografía, componentes, layouts. Solo abrí un mockup específico si:
   - Vas a implementar un componente nuevo no listado en sección 6
   - El usuario te pide replicar un detalle visual ambiguo
   - Estás resolviendo un bug visual y necesitás el código de referencia

2. **Preferí `Edit` sobre `Write`** en archivos existentes. Nunca reescribas un archivo entero por un cambio chico.

3. **No releas archivos que ya editaste en esta sesión** — el harness ya rastrea su estado.

4. **No corras `npm install` "por las dudas"** — solo cuando agregás una dependencia o el `pnpm-lock` cambió.

5. **Build/preview solo cuando el usuario lo pide o cuando vas a entregar.** El dev server cubre la mayoría de iteración.

6. **No agregues comentarios explicativos** salvo que documenten un *por qué* no obvio. Sin "// componente Hero" obvios.

7. **No crees archivos `.md` de documentación adicional** salvo que el usuario lo pida. Este CLAUDE.md es la fuente de verdad.

8. **Imágenes**: nunca generes binarios. Si faltan, dejá placeholder con ruta esperada y avisá al usuario.

9. **No hagas refactors fuera del scope pedido.** Bug fix = bug fix. Feature = feature.

10. **Si una tarea es ambigua, preguntá antes de codear.** Una pregunta ahorra 5 archivos mal hechos.

---

## 13. Estado actual del proyecto

**Última actualización**: 2026-05-22

- [x] CLAUDE.md creado
- [x] Scaffold Astro inicial (configs + package.json) — 2026-05-21
- [x] Tailwind + tokens.css — 2026-05-21
- [x] Layout base + NavBar + Footer — 2026-05-21
- [x] Home (`/`) — 2026-05-21
- [x] Componentes: BrandMark, Hero, SectionBar, UnitRow, WhatsAppCTA + 9 más — 2026-05-21
- [x] Detalle de unidad (`/unidades/[slug]`) — 2026-05-21
- [x] Servicios, Ubicación, FAQ — 2026-05-21
- [x] Galería — 2026-05-21
- [x] i18n EN espejo (18 páginas totales construyen OK) — 2026-05-21
- [x] ReviewsBlock con widget Elfsight Booking en home (ES/EN) + link al listing — 2026-05-22
- [x] Pack SEO completo (sitemap i18n, robots con bots IA, hreflang, canonicals, JSON-LD LodgingBusiness + Accommodation + FAQPage + BreadcrumbList, og:url/og:locale, geo meta, width/height en imágenes, Elfsight diferido) — 2026-05-22
- [ ] Generar `public/og/default.jpg` 1200×630 dedicada (hoy usa `/cerro uritorco.jpg` como fallback)
- [ ] Sumar widgets Elfsight de Google y Airbnb cuando el cliente decida (mismo patrón que Booking)
- [ ] Contenido real (scraping del sitio Lovable actual)
- [ ] Imágenes en `public/images/` (placeholders rotos hoy)
- [ ] Deploy a Vercel + dominio (`refugiodelcorazon.com.ar`)

### Checklist SEO post-deploy

Una vez en producción con dominio final:

1. **Google Search Console** — verificar propiedad, enviar `sitemap-index.xml`, monitorear "Cobertura" e "Indexación".
2. **Bing Webmaster Tools** — verificar y enviar sitemap (también activa Yandex).
3. **Google Business Profile** — alta del negocio en Río Negro 64. Una vez aprobado, agregar la URL del perfil en `BUSINESS.sameAs` (`src/utils/seo.ts`) — propaga al `OrganizationSchema`.
4. **Booking Partner Hub** — confirmar listing indexado; la URL canonical ya está en `BUSINESS.bookingUrl`.
5. **Validar JSON-LD** — https://search.google.com/test/rich-results y https://validator.schema.org/. Debe detectar: LodgingBusiness en home, Accommodation + BreadcrumbList en `/unidades/*`, FAQPage en `/faq`.
6. **OG/Twitter preview** — https://www.opengraph.xyz/ para `/`, `/en/`, `/unidades/*`.
7. **Lighthouse mobile** — targets: SEO 100, Performance ≥ 90, CLS < 0.1, LCP < 2.5s.
8. **Cuando se tenga `og/default.jpg` 1200×630** — editar `DEFAULT_OG_IMAGE` en `src/utils/seo.ts` y el array `image` en `OrganizationSchema.astro`.
9. **Coordenadas exactas** — confirmar `BUSINESS.latitude/longitude` en `src/utils/seo.ts`. Hoy usan `-30.8615 / -64.5306` (aproximado Capilla del Monte centro).
10. **IndexNow (opcional)** — Bing/Yandex aceptan ping para indexación instantánea cuando se publica contenido nuevo.

### Sistema SEO técnico (referencia rápida)

- **Dominio**: `https://refugiodelcorazon.com.ar` (configurado en `astro.config.mjs` y `src/utils/seo.ts`).
- **Sitemap**: `@astrojs/sitemap` con `i18n.locales = { es: 'es-AR', en: 'en-US' }`. Output: `dist/sitemap-index.xml`.
- **`public/robots.txt`**: incluye allowlist explícito para `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, etc. — habilita citas en LLMs.
- **Base.astro**: canonical, hreflang (es-AR / en / x-default), og:url/og:locale dinámicos, geo.region/position, twitter card. Prop `preloadImage` para hint LCP del hero por página.
- **`src/utils/seo.ts`**: fuente de verdad — domain, address, coords, contacts. Cambiar acá y propaga a todos los schemas/metas.
- **`src/components/seo/*`**: 4 componentes JSON-LD. `OrganizationSchema` inyectado global por `Base.astro`. `UnitSchema` + `BreadcrumbSchema` en `[slug]`. `FAQPageSchema` en `/faq`.

Cuando completes un ítem, marcalo `[x]` y agregá fecha al lado si es relevante.
