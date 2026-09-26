# Auditoría SEO técnica — El Refugio del Corazón

**Fecha**: 2026-09-26 · **Rama**: `main` (cambios locales, sin commit ni deploy) · **Commit base**: `b2a3939`

---

## 1. Contexto y arquitectura detectados

| Aspecto | Hallazgo | Fuente |
|---|---|---|
| Raíz | `C:\Users\emili\OneDrive\Escritorio\web-refugiodelcorazon` | — |
| Framework | Astro 4.16 SSG (`output: 'static'`, `trailingSlash: 'always'`) + Tailwind 3 | `package.json`, `astro.config.mjs` |
| Hosting | Vercel, adapter `@astrojs/vercel/static`. **El build real se escribe en `.vercel/output/static/`**; `dist/` es un build viejo y no refleja el sitio | build local |
| Gestor de paquetes | npm (`package-lock.json`; no hay `pnpm-lock`) | repo |
| Contenido | Content Collections: `src/content/unidades` (4 × ES/EN), `src/content/faq` (3 categorías × ES/EN). Strings de UI en `src/i18n/*.json` | `src/content/config.ts` |
| SEO centralizado | `src/utils/seo.ts` (dominio, NAP, coords), `src/layouts/Base.astro` (head), `src/components/seo/*` (JSON-LD) | — |
| Dominio de producción | `https://refugiodelcorazon.com.ar` (apex) | `astro.config.mjs` `site`, `SITE_URL` |
| Idiomas | ES (`/`, principal, mercado argentino) y EN (`/en/`, turismo internacional) | rutas |
| Negocio | 4 departamentos de alquiler temporario en Río Negro 64, Capilla del Monte | CLAUDE.md |
| Conversión | Consulta por WhatsApp (short link de WhatsApp Business). No hay reservas, pagos ni formularios | `src/utils/whatsapp.ts` |
| Medición | gtag `G-0G62WCNHJG` + Vercel Web Analytics (no se tocaron) | `Base.astro` |

**Hechos vs. hipótesis**: la intención principal ("alquiler temporario / departamentos en Capilla del Monte") se deduce de titles, contenido y CLAUDE.md. No hay datos de Search Console, así que no hay consultas ni volúmenes reales.

## 2. Alcance inspeccionado

- **Plantillas** (7): home, detalle de unidad, servicios, ubicación, galería, FAQ, 404, cada una en ES y EN.
- **URLs**: las 18 URLs indexables del sitemap + la 404. No hizo falta CSV: el inventario entra en la tabla de la §4.A.
- **Entornos**: local (build de producción en `.vercel/output/static` + dev server `localhost:4321`) y producción (curl, ~20 peticiones, secuenciales, con 1 s de pausa).
- **Navegador**: 1 página (`/unidades/unidad-1/`, mobile 375px), incluido el visor de fotos.
- **Excluido**: `node_modules`, `dist/` (build viejo), binarios de imágenes, previews de Vercel (sin acceso).

## 3. Línea de base y limitaciones

**Línea de base reproducible**: `git stash` de los cambios → `npm run build` → `node scripts/seo-check.mjs` sobre el código original → **16 fallos** (ver §8).

**Limitaciones**:
- **PageSpeed Insights API** respondió `429 Quota exceeded` → Lighthouse de laboratorio y CrUX **NO_VERIFICADOS**. Se detuvo ahí, sin reintentos, como pide el método.
- Sin acceso a Search Console, Bing Webmaster Tools ni GA4 → indexación, consultas y datos de campo **NO_VERIFICADOS**.
- No hay datos de campo de Core Web Vitals, así que no se certifica ningún umbral.
- La documentación oficial no se consultó en vivo en esta sesión. Las decisiones se apoyan en criterios estables de Google Search Central y web.dev: no aplicar lazy loading a la imagen LCP, un preload tiene que coincidir con el recurso que usa la página, las URLs de un breadcrumb tienen que resolver bien, FAQ rich results restringidos desde 2023 a sitios de gobierno/salud. Conviene revalidar antes de decisiones nuevas.

## 4. Checklist con estados y evidencia

### A. Inventario

| URL | HTTP (prod) | Plantilla | Canonical | Indexable |
|---|---|---|---|---|
| `/`, `/en/` | 200 | home | autorreferencial | sí |
| `/unidades/unidad-{1..4}/`, `/en/unidades/unidad-{1..4}/` | 200 | detalle | autorreferencial | sí |
| `/servicios/`, `/ubicacion/`, `/galeria/`, `/faq/` (+ `/en/…`) | 200 | internas | autorreferencial | sí |
| `/no-existe/` | 404 real | 404 | — | noindex |

- Titles y descriptions únicos en las 18 páginas (automatizado) — **CUMPLE**.
- Una sola `<h1>` por página — **CUMPLE**. El H1 del home es solo la marca (ver H7).
- Páginas huérfanas: las 18 están enlazadas desde el nav, el footer o el home. Solo se rastreó desde el home y el sitemap, así que no se afirma que no haya otras — **CUMPLE** (alcance local).

### B. Acceso, rastreo e indexación
- `robots.txt`: `Allow: /` general + bots de búsqueda/IA permitidos + `Sitemap:` correcto — **CUMPLE**.
- Meta robots `index,follow,max-image-preview:large` en las 18 páginas y `noindex` solo en la 404 — **CUMPLE** (automatizado).
- `X-Robots-Tag`: ausente en producción — **CUMPLE**.
- La 404 devuelve un 404 real (no soft 404) — **CUMPLE**.
- `Disallow: /404` impide que se lea el `noindex` de `/404.html` (que devuelve 200 si se pide directo). Es inocuo porque no está enlazada ni en el sitemap — **PROPUESTO** (P3, H8).
- Indexación real — **NO_VERIFICADO** (requiere Search Console).

### C. URLs, canónicas y redirecciones
- `http → https` 308 · `/faq → /faq/` 308 · sin enlaces internos a la versión sin barra — **CUMPLE**.
- **`https://www.refugiodelcorazon.com.ar/*` responde 200** en vez de redirigir al apex. Su canonical apunta al apex, así que el daño queda acotado, pero hay dos hosts sirviendo el mismo contenido — **FALLA → PROPUESTO** (H6, requiere configurar Vercel).
- Canonical absoluta, autorreferencial y con barra final en las 18 páginas — **CUMPLE** (automatizado).

### D. Sitemaps
- `sitemap-index.xml` → `sitemap-0.xml`: 18 URLs = 18 páginas indexables, sin la 404 y con alternates hreflang recíprocos — **CUMPLE** (automatizado).
- Sin `lastmod`. Es preferible a un `lastmod` falso por build — **CUMPLE**. `changefreq`/`priority` los ignora Google; son inocuos.

### E. JavaScript y renderizado
- SSG puro: el contenido, los metadatos y los enlaces están en el HTML inicial. El JS se usa solo para el lightbox, el menú, el scroll-spy y Elfsight (diferido) — **CUMPLE**.
- La navegación usa `<a href>` reales — **CUMPLE**.

### F. Arquitectura y enlazado
- Todas las páginas a ≤1 clic del home (nav + footer + filas de unidades) — **CUMPLE**.
- Breadcrumb visible en el detalle con enlaces reales — **CUMPLE**.

### G. Títulos, metadatos, HTML
- `lang` por idioma, `charset`, `viewport`, OG y Twitter completos, `og:image` 200 (default 1200×630 y una OG por unidad) — **CUMPLE**.
- Sin meta keywords — **CUMPLE**.
- `geo.position`/`ICBM` usaban coordenadas aproximadas viejas — **CORREGIDO_Y_PROBADO** (H4).
- `og:type="article"` en unidades y ubicación: cosmético, sin impacto de ranking — **NO_APLICA** (sin cambio).

### H. Intención y contenido
- Cada página tiene una intención clara (home: "alquiler temporario Capilla del Monte"; unidad: departamento concreto con capacidad; ubicación: "dónde alojarse / cómo llegar"; FAQ: dudas de reserva) — **CUMPLE**.
- H1 del home sin la propuesta de valor — **PROPUESTO** (H7, editorial).
- Volúmenes, canibalización y consultas reales — **NO_VERIFICADO** (sin Search Console).

### I. Datos estructurados
- Inventario: `LodgingBusiness` (global, `@id …/#lodging`), `Accommodation` + `BreadcrumbList` (detalle), `FAQPage` + `BreadcrumbList` (FAQ). Sin duplicados entre plugins. Todos los JSON-LD parsean — **CUMPLE**.
- `BreadcrumbList.item` generaba `https://…/#unidades/` (fragmento + barra) — **CORREGIDO_Y_PROBADO** (H2).
- `petsAllowed` contradictorio (`true` en el negocio, `false` en las 4 unidades; la FAQ visible dice "en algunos departamentos, según el tamaño") — **CORREGIDO_Y_PROBADO** (H3): se quitó de `Accommodation` porque no hay dato por unidad.
- `Accommodation.image` repetía la foto hero (7 URLs, 6 únicas) — **CORREGIDO_Y_PROBADO** (H5).
- `FAQPage`: es válido y coincide con la FAQ visible. Google limita ese resultado enriquecido a sitios de gobierno/salud, así que no se espera un rich result. Se mantiene porque describe el contenido real — **NO_APLICA** (rich result).
- Validación en el Rich Results Test — **NO_VERIFICADO** (se hace post-deploy, §11).

### J. Core Web Vitals y rendimiento
- **Detalle de unidad (8 URLs)**: el `<link rel="preload" fetchpriority="high">` pedía una variante del hero (101–263 KB) que **no está en el `srcset` del `<img>`**, así que se descargaba de más y competía con la imagen real. Además, esa imagen (la LCP probable, primera celda del mosaico) tenía `loading="lazy"` — **CORREGIDO_Y_PROBADO** (H1).
- Home: el preload del hero coincide con el background que usa `Hero` (misma función `heroBackground()`) — **CUMPLE**.
- Imágenes con `width`/`height` + `srcset` WebP 400/800/1200 (reservan espacio) — **CUMPLE**.
- Datos de campo (LCP/INP/CLS p75) y Lighthouse — **NO_VERIFICADO** (PSI 429, sin CrUX).
- `Cache-Control: max-age=0, must-revalidate` en el HTML es el default de Vercel. Los assets de `/_astro/` tienen hash — sin cambio.

### K. Imágenes, móvil, accesibilidad
- `alt` descriptivo en todas las imágenes de contenido (18/18 en el home, con captions por unidad) — **CUMPLE**.
- Mobile 375px del detalle revisado y el visor de fotos abre bien — **CUMPLE**.

### L. Internacional y local
- hreflang `es`/`en`/`x-default`, absolutos, recíprocos, que apuntan a páginas existentes (automatizado) — **CUMPLE**.
- No hay redirección automática por idioma (banner `LangSuggest`) — **CUMPLE**.
- NAP en JSON-LD igual al visible (Río Negro 64, X5184) y coords exactas — **CUMPLE**.
- Google Business Profile — **NO_VERIFICADO** (externo).

### M. Modelo de negocio
- Educación y e-commerce — **NO_APLICA**.
- Servicios/captación: 1 landing por unidad real, sin landings duplicadas por keyword. El recorrido a WhatsApp está presente en el nav, el CTA sticky, el detalle y el lightbox — **CUMPLE**.

### N. IA y Bing
- Bots de búsqueda/IA permitidos en robots. No hay instrucciones ocultas para modelos — **CUMPLE**.
- `public/llms.txt` ya existía: no se creó ni se borró. No es requisito para Google — **NO_APLICA**.
- Bing Webmaster Tools — **NO_VERIFICADO**. IndexNow: no aporta con un sitio de 18 URLs que cambia poco — **NO_APLICA**.

### O. Medición
- gtag y Vercel Analytics intactos. Eventos de conversión (clic en WhatsApp) — **NO_VERIFICADO** (sin acceso a GA4; no se ve un evento específico en el código).

## 5. Hallazgos priorizados

| ID | P | Área | URL/plantilla | Archivo | Estado |
|---|---|---|---|---|---|
| H1 | P1 | Rendimiento/LCP | 8 detalles de unidad | `PhotoMosaic.astro`, `unidades/[slug].astro` ×2 | CORREGIDO_Y_PROBADO (local) |
| H6 | P1 | Host duplicado `www` | todo el sitio | Vercel → Domains | CORREGIDO_Y_PROBADO (producción, 2026-09-26) |
| H2 | P2 | JSON-LD breadcrumb | 8 detalles | `src/utils/seo.ts` | CORREGIDO_Y_PROBADO (local) |
| H3 | P2 | JSON-LD contradictorio | 8 detalles | `seo/UnitSchema.astro` | CORREGIDO_Y_PROBADO (local) |
| H7 | P2 | H1 home | `/`, `/en/` | `Hero.astro` / i18n | CORREGIDO_Y_PROBADO (2026-09-26, aprobado por el dueño) |
| H4 | P3 | Geo meta | todas | `Base.astro` | CORREGIDO_Y_PROBADO (local) |
| H5 | P3 | JSON-LD imágenes | 8 detalles | `seo/UnitSchema.astro` | CORREGIDO_Y_PROBADO (local) |
| H8 | P3 | robots vs. noindex 404 | `/404.html` | `public/robots.txt` | PROPUESTO |

## 6. Cambios realizados

| Archivo | Cambio |
|---|---|
| `src/components/PhotoMosaic.astro` | Prop opcional `priority`: la celda 1 pasa a `loading="eager"` + `fetchpriority="high"`; el resto sigue lazy |
| `src/pages/unidades/[slug].astro`, `src/pages/en/unidades/[slug].astro` | `<PhotoMosaic priority>`; se quitaron el `getImage` del hero y el `preloadImage` (URL que no coincidía) |
| `src/utils/seo.ts` | `absoluteUrl()` agrega la barra final solo a la ruta y conserva `#fragmento`/`?query` |
| `src/components/seo/UnitSchema.astro` | Sin `petsAllowed`; `image` deduplicado |
| `src/layouts/Base.astro` | `geo.position`/`ICBM` desde `BUSINESS.latitude/longitude` |
| `scripts/seo-check.mjs` + `package.json` (`seo:check`) | Chequeo de regresión sin dependencias (ver §7) |
| `docs/seo/AUDIT.md`, `CLAUDE.md` §13 | Documentación |

## 7. Pruebas ejecutadas

| Comando | Resultado |
|---|---|
| `npm run build` (antes y después) | exit 0, sin warnings nuevos |
| `npx astro check` | 0 errores, 0 warnings, 6 hints preexistentes (variables sin uso en `CTABlock`, `NavBar`, `ServiceList` y la interfaz `Props` sin uso en los dos `[slug].astro`, ya presente en `b2a3939`) |
| `npm run seo:check` (después) | `✓ SEO OK — 18 páginas indexables + 404, 18 URLs en sitemap` |
| Inspección de `unidades/unidad-1` y `en/unidades/unidad-3` | 0 preloads de imagen; celda 1 `eager`/`high`; breadcrumb `…/#unidades`; sin `petsAllowed`; 6/6 imágenes únicas; geo `-30.8652362;-64.5283123` |
| Navegador (dev, 375px) | Detalle renderiza igual, el visor abre (1/7), 0 errores de consola, `currentSrc` = variante 800w |

`seo:check` valida: robots/noindex, canonical autorreferencial, title y description presentes y únicos, `<h1>`, hreflang es/en/x-default hacia páginas existentes, JSON-LD parseable, URLs con `#…/`, preloads de imagen no usados y sitemap sin la 404 y 1:1 con las páginas.

## 8. Antes / después

| Métrica | Antes (`b2a3939`) | Después |
|---|---|---|
| `seo:check` | 16 fallos (8 breadcrumbs `#unidades/`, 8 preloads no usados) | 0 |
| Bytes de preload desperdiciados por detalle | 101 KB (u1), 240 KB (u2), 263 KB (u3), 115 KB (u4) con prioridad alta | 0 |
| Imagen LCP del detalle | `loading="lazy"` | `eager` + `fetchpriority="high"` |
| Imágenes en `Accommodation` | 7 (1 duplicada) | 6 únicas |

No hay comparación de LCP en ms: la API de PSI seguía en 429 y no existe una medición previa al deploy (§3).

### Medición post-deploy (laboratorio) — 2026-09-26 13:50 GMT-3

pagespeed.web.dev · Lighthouse 13.5.0 · Moto G Power emulado · 4G lenta · **1 ejecución por URL** (con variabilidad esperable) · **sin datos de campo (CrUX: "No hay datos")**.

| URL | Rend. | Acc. | Recom. | SEO | FCP | LCP | TBT | CLS | Elemento LCP | Mayor subparte del LCP |
|---|---|---|---|---|---|---|---|---|---|---|
| `/unidades/unidad-2/` | 72 | 95 | 100 | 100 | 3,5 s | 4,9 s | 70 ms | 0 | texto `<h1>` "Departamento #2" | retraso de renderizado 2,38 s |
| `/` | 72 | 95 | 100 | 100 | 2,9 s | 5,3 s | 140 ms | 0 | `div.hero-bg` (fachada, 250 ms de descarga) | retraso de renderizado 1,99 s |

**Lectura**: en las dos páginas el LCP no está limitado por el servidor (TTFB 0 ms) ni por la descarga de la imagen, sino por el **retraso de renderizado**. La causa principal que muestra Lighthouse son las **solicitudes que bloquean el render (~900 ms)**: el CSS de Google Fonts (750 ms) y dos hojas CSS propias (`_slug_.css` 560 ms y `faq.css` 190 ms, 6,7 KB en total). En celular, el LCP del detalle es el título y no la foto, así que el arreglo H1 (preload) ahorra bytes pero no mueve esta métrica.

**Otros hallazgos del informe**:
- `logo-refugio.jpeg`: 1000×1000 px y 72 KB para mostrarse a 36 px (ahorro estimado de 71,5 KB en todas las páginas).
- gtag 191 KB / 157 ms de hilo principal. Es medición y no se toca sin decisión del dueño.
- Imagen del lightbox sin `width`/`height`: está oculta hasta abrir el visor y no genera CLS (CLS = 0). Sin acción.

**Propuesta J2 (P2, pendiente de aprobación)**:
1. Logo con `astro:assets` a 72/108 px → de 72 KB a ~3 KB. Bajo riesgo.
2. `build.inlineStylesheets: 'always'` en `astro.config.mjs` → elimina las 2 hojas CSS bloqueantes. Bajo riesgo; el HTML crece unos KB.
3. Fuentes: hospedar Inter y JetBrains Mono en el propio sitio (paquete `@fontsource-variable/*`, **dependencia nueva**) con preload del peso del display, o cargar el CSS de Google Fonts sin bloquear. Riesgo medio: puede verse un parpadeo de fuente.

### J2 aplicado (puntos 1 y 2) — PR #8, 2026-09-26

Logo por `astro:assets` (72 KB → 0,2–1,4 KB) + `build.inlineStylesheets: 'always'` (0 hojas CSS propias bloqueantes; HTML gzip del home 15,8 → 22,0 KB).

| `/unidades/unidad-2/` (mobile, 1 ejecución) | Antes (13:50) | Después (~14:40) |
|---|---|---|
| Rendimiento | 72 | **89** |
| FCP | 3,5 s | 2,9 s |
| LCP | 4,9 s | **2,9 s** |
| Retraso de renderizado del LCP | 2.380 ms | 370 ms |
| Speed Index | 5,1 s | 2,9 s |
| TBT | 70 ms | 120 ms |
| CLS | 0 | **0,059** (sigue < 0,1) |
| Bloqueo de render | CSS propio (750 ms) + Google Fonts (750 ms) | solo Google Fonts (750 ms) |

- **CLS nuevo (0,059)**: Lighthouse lo atribuye al cambio de fuente (woff2 de fonts.gstatic.com) sobre `<main>` y el CTA. Como la página pinta antes, se ve primero la fuente de respaldo y después se reacomoda al llegar Inter. Se resuelve con el punto 3 (fuentes propias con preload, o `size-adjust` en la fuente de respaldo).
- **Home**: la re-medición quedó trabada en "Ejecutando análisis" 2 veces → **NO_VERIFICADO**. Re-medir a mano en pagespeed.web.dev.
- Son ejecuciones únicas: una mejora de 17 puntos supera con holgura la variabilidad típica, pero conviene confirmarla con 3 ejecuciones.

**Pendiente: punto 3 (fuentes)**. Es la próxima palanca: elimina los 750 ms de bloqueo que quedan y el CLS del cambio de fuente. Requiere una dependencia nueva (`@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`) → decisión del dueño.

## 9. Cambios de alto riesgo pendientes de aprobación

**H6 — `www` → apex (P1)** — ✅ aplicado por el dueño el 2026-09-26. Verificado: `www/`, `www/faq/` y `www/unidades/unidad-1/` → 308 al apex con la ruta intacta; `http://www` → 2 saltos (https → apex), final 200.
- *Propuesta*: en Vercel → Project → Settings → Domains, configurar `www.refugiodelcorazon.com.ar` como **Redirect to `refugiodelcorazon.com.ar` (308)**, con el apex como primario.
- *Impacto*: un solo host. Las canónicas ya apuntan al apex, así que no cambia qué URL se indexa.
- *Archivos*: ninguno (configuración externa).
- *Prueba*: `curl -sI https://www.refugiodelcorazon.com.ar/faq/` → `308`, `location: https://refugiodelcorazon.com.ar/faq/`.
- *Reversión*: volver el dominio `www` a "Connect to environment: Production".
- *Nota*: la memoria del proyecto decía que `www` ya redirigía; hoy responde 200.

**H7 — H1 del home (P2, editorial/diseño)** — ✅ aplicado el 2026-09-26: bajada `hero.deck` dentro del `<h1>` ("Alquiler temporario en Capilla del Monte" / "Vacation rentals in Capilla del Monte"), a 20–30px desktop y 18px mobile, mucho más chica que el nombre, a pedido del dueño.
- *Propuesta*: incluir la propuesta de valor en el H1 sin perder la marca. Por ejemplo, un `<span>` de bajada dentro del `<h1>` con "Alquiler temporario en Capilla del Monte", como ya se hizo con `BigHeader.subtitle` en las páginas internas.
- *Archivos*: `src/components/Hero.astro`, `src/i18n/es.json`, `en.json`.
- *Riesgo*: cambia el diseño del hero; lo decide el dueño.

**H8 — `Disallow: /404` (P3)**: quitar esa línea de `public/robots.txt` para que se lea el `noindex`. Beneficio marginal.

## 10. Tareas editoriales, externas o dependientes de acceso

1. **Search Console**: inspeccionar `/` y `/unidades/unidad-1/`, revisar Páginas > Indexación, Rendimiento (consultas de marca vs. no marca) e informe de CWV.
2. **Lighthouse / PSI mobile** de `/` y `/unidades/unidad-2/` (el preload más pesado), 3 ejecuciones cada una, antes y después del deploy.
3. **Rich Results Test** de `/unidades/unidad-1/` y `/faq/`.
4. **Bing Webmaster Tools**: alta + sitemap (baja prioridad).
5. **GA4**: confirmar si hay un evento de conversión en el clic a WhatsApp. Si no lo hay, evaluar agregarlo (fuera del alcance SEO).
6. **Google Business Profile**: NAP y horario de check-in iguales al sitio.

## 11. Despliegue y verificación posterior (no ejecutado)

1. Revisar el diff y hacer commit en `main` (o PR) → Vercel despliega solo.
2. Verificar en producción:
   - `curl -s https://refugiodelcorazon.com.ar/unidades/unidad-1/ | grep -c 'rel="preload" as="image"'` → `0`
   - `curl -s https://refugiodelcorazon.com.ar/unidades/unidad-1/ | grep -o '"item":"[^"]*#unidades[^"]*"'` → `…/#unidades"` sin barra
   - `curl -sI https://refugiodelcorazon.com.ar/sitemap-index.xml` → `200`
3. Rich Results Test sobre una unidad y PSI mobile (§10.2).
4. Anotar la fecha del deploy para comparar en Search Console (CWV ≥ 28 días), sin atribuir causalidad directa.

## 12. Reversión

- Local, antes del commit: `git checkout -- src package.json` y borrar `scripts/seo-check.mjs` y `docs/seo/`.
- Después del deploy: `git revert <commit>` → Vercel redespliega. Cada lote es independiente: H1 = `PhotoMosaic` + 2 páginas de unidad; H2 = `seo.ts`; H3/H5 = `UnitSchema`; H4 = `Base.astro`.
