# Implementación de la auditoría SEO — 5 de octubre de 2026

## Cambios de las dos tandas

- **H01:** las ocho entidades `Accommodation` usan la canonical de su ficha. Se elimina el prefijo `en/` duplicado en las cuatro fichas inglesas. El chequeo nuevo reprodujo 12 fallos en el build anterior (URL, identificador y destino por ficha) y pasa con la corrección.
- **H02:** el propietario confirmó el pin de la ficha de Google Maps: `-30.8659207, -64.5248283`. Mapas incrustados, enlaces de indicaciones y metadatos usan esa ubicación. Booking usa una única URL en datos estructurados, pie y reseñas.
- **H03:** evento `whatsapp_click` mediante el Google tag existente (`G-0G62WCNHJG`). Incluye `page_path`, `page_language`, `unit` y `cta_location`; cubre navegación, menú móvil, portada, contacto, ficha, FAQ, pie, barra móvil y visor. No envía el teléfono ni el mensaje. Un clic mide intención de contacto, no una reserva o consulta confirmada.
- **H04:** mascotas con condiciones; estacionamiento para dos autos sujeto a disponibilidad en marcado y ubicación. Se retira el ambiguo `numberOfRooms: 4`.
- **H05:** portada con `picture`, recorte vertical móvil de 600/900 px y variantes de escritorio de 1200/1600/2000 px. Prioridad alta sin precarga duplicada. Se conserva `font-display: swap`.
- **H06:** títulos distintivos para #2 y #3; las ocho fichas muestran una bajada con distribución y limitaciones. Se sustituyen itinerarios de carretera no verificados por rutas calculadas a la entrada y se añade orientación para llegar sin auto.
- **H08:** `llms.txt` se genera desde las colecciones de unidades y FAQ; capacidades, dormitorios, equipamiento y condiciones se mantienen junto con las fichas. No se atribuye a este archivo un efecto en el ranking de Google.
- **H09:** robots permite rastrear la página de error para leer su `noindex`; sigue fuera del sitemap.

## Verificación local

`npm run check`, `npm run build`, `npm run seo:check` y `npm test`. El build contiene 18 páginas indexables, la 404 y el endpoint de texto. El sitemap conserva las 18 URLs HTML. Hay cuatro pruebas del evento de contacto: activación normal, botón central y exclusiones, cambio de unidad del visor y ausencia de Analytics. El chequeo del HTML también exige contexto en todos los enlaces de WhatsApp.

Revisión visual de portada, ficha EN y ubicación; mapa cargado y visor probado. El control de tamaño de la ventana del navegador no modificó su ancho efectivo, por lo que se revisaron además las páginas en marcos locales de 390 px. Inicio y ficha tienen 375 px útiles sin desbordamiento horizontal, y el inicio elige la variante móvil de 600 px. Esta prueba de diseño no sustituye una medición en un teléfono físico.

## Rendimiento: referencia antes de publicar

PageSpeed Insights, móvil, Lighthouse 13.5.0, Moto G Power emulado y 4G lenta, 5 de octubre de 2026. Una ejecución por página; sin datos de campo disponibles. Los resultados de laboratorio varían y no demuestran por sí solos una mejora sostenida.

| Página | Rendimiento | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|
| Inicio | 80 | 1,0 s | 4,7 s | 50 ms | 0 |
| Unidad #2 | 83 | 1,0 s | 4,2 s | 90 ms | 0 |
| Galería | 82 | 1,0 s | 4,5 s | 130 ms | 0,058 |

La imagen antigua de la portada pesa 231.928 bytes. Las nuevas variantes móviles pesan aproximadamente 23 y 52 KB. Ese ahorro de transferencia está comprobado; el efecto en LCP debe contrastarse tras la publicación, manteniendo condiciones comparables. No se han quitado fuentes ni analítica para mejorar una puntuación.

## Search Console y dependencias externas

Propiedad verificada mediante GSC Wizard el 5 de octubre. Sitemap recibido con 18 URLs, sin errores ni advertencias. La inspección de las 18 URLs muestra:

| Estado reportado por Google | Páginas |
|---|---|
| Enviada e indexada | Inicio ES/EN; galería ES; ubicación ES; FAQ ES; unidades #1, #3 y #4 ES |
| Descubierta, actualmente sin indexar | Unidad #2 ES; unidad #3 EN |
| Desconocida para Google | Unidades #2 y #4 EN |
| Alternativa con canonical adecuada | Servicios EN; FAQ EN; unidad #1 EN |
| Duplicada, Google elige otra canonical | Galería EN; ubicación EN |
| Página con redirección | Servicios ES (último rastreo: 25 de junio) |

El estado de inspección refleja el último rastreo, no una prueba en vivo. La web actual entrega `/servicios/` con 200 y canonicals propias en EN. El conector no expone la URL canonical elegida, así que no se adivina su destino. Volver a inspeccionar después del recrawl; no se garantiza indexación inmediata.

Resultados agregados del 5 de septiembre al 2 de octubre: 13 clics y 157 impresiones por dispositivo (8 clics móviles, 5 de escritorio). Argentina aporta 11 clics. La muestra de consultas visibles es pequeña; no alcanza para atribuir volumen o intención de reserva a nuevas palabras clave. Los detalles de cuenta se conservan fuera del repositorio.

**GA4:** el código de medición queda preparado. Al momento de la comprobación, GSC Wizard no tenía autorizado el alcance de Google Analytics. Queda por verificar recepción en Tiempo real/DebugView, marcar `whatsapp_click` como evento clave y registrar las dimensiones de evento necesarias. No contabilizar también el `click` genérico como una segunda conversión. Referencia: [eventos con Google tag](https://developers.google.com/analytics/devguides/collection/ga4/events).

**H07, Lovable:** se identificó el proyecto antiguo `a39bb25d-009f-4007-8660-054eada2d80f`, cuyo HTML aún usa el título `capilla-monte-apartments-web`. El conector permite leerlo pero no ofrece publicación directa; la sesión del navegador requiere iniciar sesión. El propietario está habilitando el acceso para resolver la migración. No considerar el sitio anterior redirigido o desindexado hasta verificar la respuesta pública. [Editor del proyecto](https://lovable.dev/projects/a39bb25d-009f-4007-8660-054eada2d80f).

Después del despliegue: comprobar las URLs públicas, reenviar el sitemap y registrar las mediciones nuevas. Comparar tráfico orgánico, clics de contacto y consultas reales a los 28–30 días teniendo en cuenta estacionalidad; no equiparar clics a reservas.
