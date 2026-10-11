# Implementación de la auditoría UX/UI

Fecha: 10 de octubre de 2026. Alcance: sitio Astro local en español e inglés.

Se implementaron cambios para los 32 hallazgos de [la auditoría](./AUDITORIA-2026-10-10.md). Se conservan la identidad editorial, Inter/JetBrains Mono, la paleta papel/tinta/terracota y las consultas por WhatsApp. No se agregaron dependencias de producción.

## Cambios por hallazgo

| ID | Corrección implementada |
|---|---|
| UX-01 | Menú móvil con cierre propio, oscuro sobre papel y área de 44 × 44 px. |
| UX-02 | Menú con `dialog.showModal()`: fondo inactivo, foco inicial en cerrar, Escape y devolución del foco. |
| UX-03 | En ubicación móvil el mapa y la tarjeta ocupan filas independientes; la tarjeta deja de quedar debajo del iframe. |
| UX-04 | Nuevo token de acción `#A4472F`; contraste con `#F4F0E6`: **5,24:1**. Hover oscurece el botón. Captions sobre superficies más opacas. |
| UX-05 | Enlaces numéricos de WhatsApp con borrador localizado, unidad, fechas, personas y camas. El contexto se mantiene en navegación, pie, botón fijo, fichas y visor. Se valida la configuración del número al construir. |
| UX-06 | El contenido con `data-reveal` es visible por defecto. Se elimina del layout la dependencia del script de aparición. Preguntas y ampliación de galería usan `details` nativo; las fotos conservan enlaces directos. |
| UX-07 | Menú de altura dinámica con desplazamiento vertical; cierre al pasar al ancho de escritorio y restauración del scroll. |
| UX-08 | Grilla de servicios con columnas `minmax(0,1fr)`, salto a dos columnas antes del punto problemático y contenido flexible. Ajuste adicional de filas de unidades entre 901 y 1200 px. |
| UX-09 | Indicador de categoría de FAQ actualizado por posición de lectura y `aria-current="location"`. |
| UX-10 | Página activa señalada en navegación de escritorio y móvil. |
| UX-11 | Enlace de salto al contenido, visible al recibir foco, con destino enfocable. |
| UX-12 | Objetivos ampliados en menú, idiomas, sugerencia de idioma, acciones, índice, enlaces de sección y pie. Se retira el diminuto enlace «+» redundante de las unidades. |
| UX-13 | Aumento de tamaño de especificaciones, captions, respuestas, metadatos y texto del pie; menor uso de mayúsculas y espaciado excesivo. |
| UX-14 | Nombre del alojamiento visible junto al sello en móvil; borde del sello con contraste acorde al fondo. |
| UX-15 | Portada con capacidad global, cocina propia, patio compartido y acceso «Elegí tu departamento». Desenfoque reducido y equivalente en WebKit. |
| UX-16 | Comparación de los cuatro departamentos: capacidad, metros, distribución, camas y condición diferencial. Datos nuevos en las colecciones ES/EN. |
| UX-17 | Encabezado de ficha móvil alineado a la izquierda, especificaciones flexibles y sin duplicar el botón fijo de WhatsApp en el encabezado. |
| UX-18 | Equipamiento privado separado de patio y parrillas compartidas. Lavarropas destacado en el departamento #4. |
| UX-19 | «Tu estadía» y «Qué incluye tu estadía» reemplazan la promesa amplia de «Todo incluido». Cochera y limpieza durante estadías largas se explican por separado. |
| UX-20 | Resumen de horarios, seña/pago, mascotas y cochera en inicio y fichas, con enlace a reserva/cancelación y orientación para consultar precio final. |
| UX-21 | Tres fotos iniciales por grupo y ampliación nativa para el resto. Se conservan las **40 fotos** por idioma. Índice móvil con las cinco opciones visibles. |
| UX-22 | Fotos de inicio identificadas por unidad, también en sus nombres accesibles. El visor actualiza unidad, enlace a la ficha y borrador de WhatsApp al cambiar de foto. |
| UX-23 | Etiquetas breves en miniaturas; descripciones completas en texto alternativo y visor. Galería dedicada con captions fuera de la imagen. |
| UX-24 | Error localizado, reintento, anuncio del contador/caption, filtrado de controles ocultos en el recorrido de foco y conservación de navegación/cierre. |
| UX-25 | Enlace permanente a Booking y contenido propio visible. Panel Elfsight ES bajo solicitud, con mensaje de carga/fallo, sin reservar un gran hueco ni esconder su marca. |
| UX-26 | Botón que identifica Google Drive y avisa que abre otra pestaña. Los cuatro archivos muestran permiso «Cualquier persona con el enlace; no es necesario iniciar sesión» en Drive. No se inventan duraciones. |
| UX-27 | Pie, navegación, captions, títulos del visor y consultas localizados. En EN se enlazan las reseñas a Booking sin insertar una interfaz de proveedor configurada en español. |
| UX-28 | 404 estático bilingüe con salidas explícitas a ambos inicios y sus departamentos. Los enlaces de idioma del 404 apuntan a rutas existentes. |
| UX-29 | Selector y sugerencia de idioma conservan el fragmento; guardado de preferencia tolerante a restricciones de almacenamiento. |
| UX-30 | `/privacidad/` y `/en/privacidad/`, enlazadas desde el pie: WhatsApp, medición, preferencias locales y proveedores externos. Texto descriptivo de la implementación, sin afirmar una certificación legal. |
| UX-31 | `sizes` adaptados a las celdas grandes/pequeñas del mosaico, la tira de inicio y la nueva grilla de galería. |
| UX-32 | Se eliminan temperaturas sin fuente y superlativos no sustentados; distancias indicadas como aproximadas, lugares enlazados a Maps y acceso al SMN para consultar el pronóstico. |

## Verificación automática

- `npm run check`: sin errores, advertencias ni hints.
- `npm run build`: 21 páginas, incluidas las dos nuevas páginas de privacidad y 404.
- `npm run seo:check`: 20 páginas indexables y 20 URLs de sitemap; canonicals, alternancias y contexto de medición válidos.
- `npm run ux:check`: **1.039 enlaces internos**, destinos y fragmentos existentes; unidad e idioma de los borradores; 40 fotos y cinco grupos desplegables por galería.
- `npm test`: **7 pruebas aprobadas**, sobre codificación/contexto de enlaces y eventos de WhatsApp sin texto del mensaje.
- `git diff --check`: sin errores de espacios.

El chequeo UX recorre el HTML generado, no una lista de enlaces escrita a mano. No sustituye una revisión visual ni un lector de pantalla.

## Interacciones comprobadas en navegador

- Portada y ficha #4 a 390 px: jerarquía, imágenes, marca, acciones y botón fijo.
- Menú a 390 × 844: estado modal nativo, cierre visible, Escape y devolución del foco.
- Menú a 844 × 390: contenido desplazable; al pasar a 1024 px cierra y libera el scroll.
- Servicios a 1024 px: sin desbordamiento horizontal.
- Barrido a 320 px de inicio, servicios, ubicación, FAQ, ficha #4 y galería EN: sin desbordamiento del documento. El fondo ampliado del hero queda recortado por su contenedor.
- Galería a 390 px: cinco grupos y 40 fotos conservadas; recorrido inicial medido de aproximadamente **7.626 px**, frente a 16.706 px en la auditoría. Las ampliaciones están cerradas durante esa medición; ajustes finales menores de espaciado pueden cambiarla.
- Índice hasta #4, apertura del visor, siguiente foto, contador y consulta con contexto #4.
- Caso temporal con imagen inexistente: aviso, reintento fallido sin bloquear navegación, siguiente imagen válida, Escape y regreso del foco al enlace inicial. La página y el recurso de prueba fueron retirados.
- Cambio ES → EN desde `/galeria/#unidad-3`: destino `/en/galeria/#unidad-3`, con título «Apartment #3».
- FAQ: navegación a `#cat-3` actualiza el indicador a «Durante la estadía».
- Ficha #4: los ocho enlaces de WhatsApp contienen #4 y mensaje en español.
- Drive: el visor muestra los cuatro archivos y el permiso público indicado arriba. No se afirma haber reproducido cada video completo.

## Cierre de los casos pendientes de navegador

Se retomó la revisión con Playwright en navegadores aislados, ya que la herramienta de navegación anterior no podía iniciar. Se usó el sitio construido localmente, sin desplegarlo ni enviar consultas.

**Matriz:** las 21 páginas se comprobaron a 320, 390, 640, 768, 900, 901, 1280 y 1440 px en Chromium y WebKit: **336 combinaciones**, sin desbordamiento horizontal del documento. El informe registra el ancho realmente observado; esta vez el caso de 901 px sí utiliza 901 px.

**Casos funcionales:** salto al contenido con teclado; menú modal, Escape, foco, desplazamiento en orientación horizontal y cambio de breakpoint; visor con flechas, consulta contextual, recorrido de teclado, historial Atrás y devolución de foco; fallo de imagen y reintento exitoso; cambio de idioma con fragmento; navegación, FAQ y galería con JavaScript deshabilitado; reseñas con proveedor bloqueado; interacción mientras se demoran las imágenes; capturas y carga real de Elfsight. Cada suite completa agrupa estos casos en 12 comprobaciones: **12/12 aprobadas en Chromium y 12/12 en WebKit**, sin errores de aplicación no capturados. La comprobación específica posterior de Chromium también aprobó visor y capturas.

Las pruebas encontraron y permitieron corregir cuatro problemas adicionales:

1. **Visor en horizontal:** a 844 × 390 px la descripción terminaba debajo del botón de consulta. Se reserva altura para foto, descripción y controles también en pantallas bajas.
2. **Teclado del visor en WebKit:** la configuración que omite enlaces al tabular podía sacar el foco del modal. Ahora el visor recorre explícitamente sus controles visibles en ambos sentidos. Al cerrar se vuelve al enlace de la foto que lo abrió, incluso si el navegador no lo había enfocado al hacer clic.
3. **Salto al contenido en WebKit:** `tabindex="0"` hace explícita su participación en la navegación por teclado.
4. **Reseñas cargadas con aviso de espera:** Elfsight renderiza contenido en línea sin las clases esperadas. La detección ahora reconoce contenido visible y retira el aviso. El observador también permite reconocer una respuesta posterior al tiempo de espera.

Se confirmó la carga real del panel público de Elfsight en ambos motores, con respuestas del servicio y reseñas visibles. También se bloqueó el proveedor deliberadamente para comprobar el enlace permanente a Booking y el mensaje alternativo. Esto verifica el comportamiento observado, no garantiza disponibilidad futura del proveedor.

Las [capturas y resultados](./evidencias/README.md) incluyen el inicio, servicios a 901 px, ficha #4 móvil, galería a 320 px, ubicación, menú y visor horizontales, reseñas cargadas/fallidas e inicio sin JavaScript. El script reproducible es `scripts/ux-browser-check.mjs`, disponible como `npm run ux:browser`; usa Playwright externo y no agrega dependencias de producción. La última corrección del foco se volvió a comprobar en Chromium y en la suite completa de WebKit.

## Límites y tareas de publicación

**Actualización del 11 de octubre:** se completó el zoom nativo al 200/400 % en Chromium, junto con 53 análisis automáticos de accesibilidad y pruebas de espaciado. Se corrigieron contraste, nombres accesibles, estructura de regiones y títulos. Ver [informe y pendientes manuales](./ACCESIBILIDAD-2026-10-11.md).

Permanecen fuera de lo comprobado en este entorno:

- Safari/iOS y Chrome/Android en **dispositivos físicos**, incluido regreso desde la aplicación de WhatsApp y barras/áreas seguras del teléfono. WebKit en Windows no sustituye un iPhone.
- Lectura con un lector de pantalla real. Se verificaron teclado, foco y estados, pero no la experiencia hablada.
- Zoom y ajustes de accesibilidad de Safari y de teléfonos reales. El zoom nativo de Chromium al 200/400 % ya se comprobó el 11 de octubre.
- Rendimiento con una conexión móvil real. El caso de red lenta demora las imágenes para verificar que navegación y consulta siguen disponibles; no produce una puntuación de rendimiento.

Los recursos externos se bloquean en las pruebas generales para evitar enviar medición; el caso específico de reseñas permite solo los dominios de Elfsight. La suite no certifica el mapa externo ni la reproducción completa de los videos.

Los cambios están en el repositorio local; **no se desplegaron**. Antes del despliegue, el entorno debe conservar `PUBLIC_WHATSAPP_NUMBER` con el número del negocio utilizado en la configuración local. El build falla si falta o es inválido, en vez de publicar un destino ficticio.

La página de privacidad documenta la implementación técnica actual; no decide por el titular plazos de conservación, base legal o requisitos de consentimiento. Esas definiciones de operación no se inventaron. La cuenta/idioma/licencia de Elfsight y cualquier futura modificación de permisos de Drive se administran en sus servicios respectivos.
