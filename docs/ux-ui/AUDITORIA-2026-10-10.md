# Auditoría UX/UI — El Refugio del Corazón

**Fecha:** 10 de octubre de 2026 · **Sitio:** https://refugiodelcorazon.com.ar/ · **Código revisado:** `92f9b80`.

**Objetivo:** facilitar que una persona entienda la propuesta, elija el departamento adecuado y consulte por WhatsApp con suficiente información. La auditoría respeta el modelo del negocio: consultas directas, sin calendario de disponibilidad, pagos, cuentas ni reservas automáticas.

## 1. Diagnóstico ejecutivo

El sitio tiene una identidad visual reconocible y una base funcional aprovechable: fotografías del alojamiento, paleta cálida coherente, fichas con diferencias concretas entre departamentos, contenido en dos idiomas y un visor de fotos con buenas soluciones de teclado. No necesita reemplazar su identidad ni empezar de cero.

La principal debilidad está en la continuidad de la experiencia. Algunos controles fallan en estados específicos de móvil; la consulta pierde el departamento elegido; y comparar alojamientos exige recorrer demasiado contenido. La estética editorial tiene personalidad, pero los números grandes, las etiquetas pequeñas y las reiteraciones compiten con la información necesaria para decidir.

Se documentan **32 hallazgos: 6 de prioridad alta, 24 de prioridad media y 2 de prioridad baja**. No se detectó una caída general ni un bloqueo total del sitio. Las prioridades expresan impacto previsto y alcance; no son una puntuación automática ni una medición de pérdida de reservas.

**Resolver primero:** cierre y teclado del menú móvil, tarjeta oculta por el mapa, contraste de botones, contexto de WhatsApp y contenido oculto si falla JavaScript. Después, simplificar comparación, jerarquía de las fichas y legibilidad.

## 2. Alcance, método y límites

### Qué se revisó

- Las 18 páginas principales: inicio, servicios, ubicación, FAQ, galería y cuatro departamentos, en español e inglés.
- La recuperación desde una dirección inexistente bajo `/en/`.
- Navegación real en el sitio publicado, capturas visuales, árbol de accesibilidad, estilos calculados, dimensiones y orden del foco.
- Menú móvil, fichas, acordeones, índice de galería, visor, cambio de tamaño de pantalla, enlaces de consulta y reseñas.
- Código de componentes, estilos, contenido, idiomas y medición de WhatsApp.
- Las cuatro pruebas existentes de analítica: **4 aprobadas, 0 fallidas**. Esto verifica esos casos de analítica; no certifica toda la interfaz.

### Matriz de cobertura

| Cobertura | Pantalla o condición | Resultado |
|---|---|---|
| 18 rutas ES/EN | 390 × 844 | Contenido principal cargado; un H1 por ruta; sin desbordamiento horizontal del documento en este recorrido |
| Seis plantillas ES: inicio, ficha #1, servicios, ubicación, FAQ y galería | Anchos 320, 768, 1024 y 1440; altura 900 | Medición de ancho y disposición; desbordamiento detectado en Servicios a 1024 |
| Inicio, ficha, mapa, FAQ, galería y reseñas | 390 × 844 | Inspección visual y recorridos de interacción |
| Servicios | 1024 × 768 | Confirmación visual de grilla que excede el ancho |
| Menú | 844 × 390 | Pie del menú fuera de pantalla; sin desplazamiento interno |
| Menú abierto | Cambio de 844 a 1024 de ancho | Permanece abierto; el botón de cierre desaparece por el cambio de diseño |
| Visor de la ficha #1 | Teclado y Atrás del navegador | Avance, cierre, ciclo de Tab y retorno del foco comprobados |
| Galería | Salto a departamento #4 | Ancla y selección activa funcionan; título queda debajo de las barras fijas |
| FAQ | Salto a categoría 3 | La categoría visualmente activa sigue siendo la primera |
| Ruta inexistente en inglés | `/en/__auditoria-404__/` | Se muestra página y navegación de recuperación en español |

En este navegador, una ventana de 390 px dejó aproximadamente 375 px de ancho de contenido por la barra de desplazamiento. Las alturas y anchos indicados son mediciones de esta sesión, no dimensiones universales en todos los dispositivos.

### Cómo interpretar la evidencia

- **Comprobado en vivo:** comportamiento observado en la web publicada.
- **Comprobado en código:** causa o ausencia verificable en los archivos; los escenarios de fallo no siempre se provocaron en el navegador.
- **Evaluación de diseño:** juicio profesional sobre claridad o esfuerzo; conviene validarlo con personas antes de atribuirle una mejora de conversión.

No se hicieron entrevistas, pruebas con huéspedes, reservas ni envíos de mensajes. No se midieron Core Web Vitals actuales ni conversiones reales. No se ejecutó una certificación WCAG completa, lectores de pantalla, zoom real al 200/400 %, Safari/iOS, Android físico, red lenta ni todos los destinos externos. Las capturas se inspeccionaron durante la sesión; este informe conserva evidencia textual y pasos de reproducción, no archivos de captura.

El servidor local inició con errores `EPERM` al resolver archivos y dependencias. Por eso la validación visual se hizo sobre producción y se contrastó con el código local. No se interpreta esa limitación del entorno como un fallo del sitio público, ni se afirma haber validado un build nuevo.

## 3. Fortalezas que conviene conservar

1. **Identidad consistente.** Papel, tinta y terracota forman un lenguaje reconocible. Inter y JetBrains Mono están integradas deliberadamente; cambiar las fuentes no es una prioridad.
2. **Fotografías del producto.** Se muestran interiores y espacios comunes, con pies informativos y galerías por unidad.
3. **Diferencias relevantes ya explicadas.** El #1 informa que no tiene horno; el #3 advierte que se accede al baño por el dormitorio principal; el #4 describe habitaciones y lavadero.
4. **Consulta explícita.** “Consultar por WhatsApp” representa correctamente el flujo manual y no promete una reserva automática.
5. **Visor bien encaminado.** Se comprobó foco inicial en cerrar, ciclo de teclado, aislamiento del fondo, siguiente foto, Escape, Atrás y retorno al disparador. Mantener estas garantías.
6. **Galería con orientación.** El índice fijo funciona y las anclas compensan la altura de la navegación. No sustituirlo por un carrusel obligatorio sin accesos directos.
7. **FAQ nativa.** Los acordeones emplean `details/summary`; no necesitan una reconstrucción compleja.
8. **Imágenes y carga.** Hay variantes WebP, dimensiones, carga diferida y prioridad para imágenes principales. No se parte de una web sin optimización.
9. **Accesibilidad parcial ya resuelta.** Hay foco visible global, etiquetas en controles del visor y consideración de movimiento reducido.
10. **Medición con criterio.** El evento de WhatsApp diferencia ubicación del botón y unidad, y no confunde en su implementación un clic con una reserva confirmada.

La capacidad del #4 **es consistente**: queen para dos + dos plazas en la segunda habitación + una en la tercera = cinco. No corresponde cambiarla por una lectura equivocada de la distribución.

## 4. Hallazgos de prioridad alta

### UX-01 · El botón de cerrar desaparece al abrir el menú desde la portada

**Evidencia:** comprobado en vivo a 390 × 844. Abrir el menú al inicio del home produce un panel crema; el icono de cierre conserva el color crema de la navegación sobre la fotografía. Ambos colores calculados fueron `rgb(244, 240, 230)`.

**Impacto:** una persona puede interpretar que no hay forma de cerrar el panel. Afecta la primera exploración del sitio.

**Causa:** `src/components/NavBar.astro:86` cambia el estado del botón y del panel, pero no el tema visual de la barra. `.nav-hero` conserva su color hasta que se activa el estado por desplazamiento.

**Solución:** vincular el color de la navegación al estado abierto del menú. En ese estado, usar fondo y controles con contraste suficiente independientemente del scroll.

**Aceptación:** abrir/cerrar al inicio y después de desplazarse, en ES/EN; la cruz se reconoce siempre, tiene foco visible y sigue siendo operable.

### UX-02 · El teclado sale del menú móvil hacia contenido oculto detrás

**Evidencia:** comprobado en vivo. Con el panel abierto, pulsar Tab desde su último botón de WhatsApp llevó el foco al CTA del hero. El árbol de accesibilidad seguía exponiendo el fondo.

**Impacto:** una persona que usa teclado puede perder la ubicación o activar enlaces que no ve. El menú ocupa toda la pantalla y bloquea el scroll, pero no se comporta como una capa modal completa.

**Causa:** `NavBar.astro:86–104` no gestiona aislamiento del fondo, entrada/retorno del foco ni ciclo de tabulación. El visor del mismo sitio sí implementa estas medidas.

**Solución:** elegir y completar un patrón coherente. Para el panel actual: aislar el fondo, mantener accesibles el cierre y los enlaces, devolver foco al botón al cerrar y soportar Escape.

**Aceptación:** Tab y Shift+Tab nunca enfocan contenido cubierto; Escape cierra y devuelve el foco; un lector de pantalla recorre únicamente la capa disponible. Referencia: [patrón de diálogo modal de W3C](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).

### UX-03 · El mapa tapa la tarjeta de ubicación en móvil

**Evidencia:** comprobado en `/ubicacion/` a 390 × 844; la plantilla inglesa comparte la causa. La tarjeta existe en el documento, pero no se ve. En un punto dentro de ella, el elemento superior era el `iframe` del mapa. La tarjeta tenía `position: static` y el mapa seguía absoluto con `z-index: 1`.

**Impacto:** se ocultan la explicación sobre estacionamiento y el acceso “Ver en Google Maps”. El usuario ve un mapa, pero pierde la información prevista junto a él.

**Causa:** la regla móvil de `src/pages/ubicacion.astro` cambia solo la tarjeta a posición estática. Su `z-index` deja de ordenar esa superposición; el contenedor además limita la altura y oculta el desbordamiento. Mismo patrón en `src/pages/en/ubicacion.astro`.

**Solución:** en móvil, poner mapa y tarjeta consecutivos en el flujo normal, con alturas independientes. El componente de ubicación del home ya usa una estructura adaptable que sirve como referencia.

**Aceptación:** dirección, condición de cochera y enlace visibles y clicables a 320/390/720 px, en ambos idiomas, incluso si el mapa no carga.

### UX-04 · Contraste insuficiente en los botones principales

**Evidencia:** color del texto `#F4F0E6` sobre fondo `oklch(0.61 0.14 38)`, aproximadamente `#C86140`. El cálculo desde los valores CSS da **3,5345:1**. Los textos medidos tienen 12–14 px; no son texto grande.

**Impacto:** reduce la legibilidad de la acción central, especialmente con baja visión o luz exterior. Afecta botones normales, barra móvil y botón del visor que usan esa combinación.

**Causa:** `src/styles/tokens.css` y `.cta-pill` en `src/styles/global.css:123`. El estado hover aumenta el brillo y debe revisarse también.

**Solución:** conservar el terracota como identidad y definir una variante más oscura para superficies con texto claro, o usar tinta para la acción principal. No cambiar toda la paleta sin necesidad.

**Aceptación:** texto normal con contraste mínimo de 4,5:1 en todos los estados aplicables; foco perceptible en fondos claros y oscuros. Referencia: [WCAG 2.2, contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

### UX-05 · WhatsApp pierde el departamento y el idioma de la consulta

**Evidencia:** los enlaces de consulta inspeccionados en las 18 rutas usan exactamente `https://wa.me/message/G2SJBL3SDPAMB1`. En `src/utils/whatsapp.ts:5`, `waLink` ignora mensaje e idioma; `waLinkForUnit` ignora también el nombre de unidad. La ficha prepara un mensaje que nunca llega al enlace.

**Impacto:** tras elegir alojamiento, la persona tiene que volver a explicar cuál le interesa. El anfitrión recibe menos contexto y necesita hacer preguntas adicionales. No se comprobó el mensaje configurado dentro de WhatsApp; sí que el sitio no transmite una distinción por unidad o idioma.

**Solución:** acordar un mecanismo compatible con la cuenta del negocio que conserve unidad e idioma. Revisar todos los puntos de entrada: cabecera, ficha, pie, barra móvil y visor. El `Base` no pasa mensaje a la barra móvil, y el visor de ficha tampoco recibe uno específico; cambiar solo el helper sería insuficiente.

**Aceptación:** desde el #3, la consulta preparada identifica el #3; desde EN, el idioma es coherente; espacios comunes conservan contexto general. Si se mantiene obligatoriamente el enlace corto único, ofrecer una forma visible de copiar un resumen de consulta. No enviar mensajes durante las pruebas.

### UX-06 · Parte del contenido queda invisible si no se ejecuta el script de aparición

**Evidencia:** comprobado en código; no se desactivó JavaScript en el navegador. `src/styles/global.css:177` aplica `opacity: 0` a todo `[data-reveal]`. `src/scripts/reveal.ts` es quien lo vuelve visible. Las filas de departamentos del home usan ese atributo.

**Impacto:** un fallo o bloqueo del script puede dejar vacíos bloques esenciales para elegir alojamiento. La página estática contiene la información, pero visualmente no la muestra.

**Solución:** contenido visible por defecto; habilitar la preparación de la animación solo cuando el script está operativo. Añadir recuperación explícita para el escenario sin JavaScript. Revisar también que el menú móvil tenga una alternativa útil si el script falla.

**Aceptación:** sin JavaScript, o bloqueando el módulo de aparición, se ven los cuatro departamentos y se pueden seguir sus enlaces. Movimiento reducido debe seguir mostrando todo. No basta con desactivar las transiciones si permanece la opacidad cero.

## 5. Navegación, adaptación y accesibilidad — prioridad media

### UX-07 · El menú no resuelve pantallas bajas ni el cambio a escritorio

**Evidencia:** a 844 × 390, el panel medía 390 px, su contenido 559 px y el pie comenzaba alrededor de y=444; `overflow-y` era `visible` y el body estaba bloqueado. Al ampliar a 1024 px permaneció abierto, con scroll bloqueado y botón oculto por la regla de escritorio.

**Solución:** panel con desplazamiento vertical propio y altura dinámica; cierre/reconciliación de estado al cruzar el breakpoint. **Aceptación:** acceso a idioma y CTA en horizontal; cambio a escritorio sin overlay residual ni bloqueo. **Referencia:** `NavBar.astro`, estado `setState` y estilos `.nav-mobile-menu`.

### UX-08 · La grilla de Servicios desborda a 1024 px

**Evidencia:** comprobado en vivo. Ancho disponible 1009 px frente a `scrollWidth` de 1034 px. La cuarta tarjeta de “Elegí dónde alojarte” se extiende fuera del documento; apareció barra horizontal.

**Causa:** cuatro columnas y mínimos intrínsecos de las tarjetas entre 901 y 1024 px. **Solución:** adelantar el paso a dos columnas, usar columnas con mínimo flexible y permitir encogimiento del contenido. **Aceptación:** sin scroll horizontal ni flechas cortadas en 901, 1024 y 1100 px, ES/EN. **Referencia:** `src/pages/servicios.astro`, `.serv-units-grid` y `.serv-units-item`; espejo EN.

### UX-09 · La categoría activa de FAQ siempre es la primera

**Evidencia:** al seleccionar “Durante la estadía”, la URL cambió a `#cat-3`, pero `.faq-aside-item.on` continuó siendo “Check-in y check-out”. `src/pages/faq.astro:39` fija el estado con `i === 0`; no lo actualiza.

**Solución:** sincronizar estado con el destino o la sección visible; alternativamente, retirar la falsa selección si no se va a implementar seguimiento. **Aceptación:** indicador correcto al hacer clic, desplazarse o entrar por un ancla; comunicarlo también con `aria-current` cuando corresponda. Aplicar en ES/EN.

### UX-10 · La navegación principal no indica la página actual

**Evidencia:** los enlaces de `NavBar.astro` se generan con la misma clase; no hay estado activo ni `aria-current`. Una página interna se ve identificada principalmente por su título, no por la navegación.

**Solución:** distinguir la sección actual con peso, subrayado o marcador coherente. Asociar los detalles a Departamentos. **Aceptación:** estado visible y accesible en escritorio y menú móvil, sin depender solo del color; no marcar todas las anclas del home como activas.

### UX-11 · Falta un acceso para saltar al contenido

**Evidencia:** `src/layouts/Base.astro:110–117` coloca navegación antes de `main`, sin enlace de salto. El menú se repite en cada página.

**Solución:** primer enlace de teclado “Saltar al contenido”, visible al recibir foco, apuntando al contenido principal. **Aceptación:** con la primera tabulación se puede evitar el bloque repetido; el destino queda enfocado y no oculto bajo la barra fija. La existencia de un `main` es positiva, pero no sustituye por sí sola ese recorrido visual de teclado.

### UX-12 · Algunos controles tienen un área táctil demasiado pequeña

**Evidencia:** botón del menú medido en **28 × 22 px**, sin padding. `.chip-more` tiene 30 px de ancho y texto de 16 px con line-height 1. Los selectores ES/EN también son compactos.

**Solución:** ampliar superficies clicables a unos 44 × 44 px como objetivo de comodidad, sin hacer necesariamente más grande el dibujo. **Aceptación:** no solapar áreas vecinas y comprobar uso con dedo y foco. El mínimo WCAG 2.2 de 24 × 24 px tiene excepciones de separación; un tamaño inferior no demuestra por sí solo incumplimiento si se aplica una excepción. Referencia: [W3C, tamaño mínimo de objetivos](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).

### UX-13 · La información secundaria es demasiado pequeña para su importancia

**Evidencia:** respuestas FAQ móviles de 12,5 px; capacidades y otros datos alrededor de 11–11,5 px; pies de fotografías de 9,5 px, en mayúsculas y con espaciado amplio. Se observó dificultad de lectura relativa frente a titulares muy grandes.

**Solución:** reservar el microtexto para decoración; usar aproximadamente 15–16 px en respuestas y 13–14 px en datos que deciden una reserva, ajustados visualmente. Reducir mayúsculas en frases extensas. **Aceptación:** camas, capacidad, condiciones y captions se leen sin ampliar y soportan crecimiento de texto sin solaparse. Es una recomendación de legibilidad, no un mínimo tipográfico impuesto por WCAG.

### UX-14 · En móvil, la marca depende de un sello muy pequeño y pálido

**Evidencia:** `.nav-name` se oculta por debajo de 900 px; queda el logo de 30–32 px. En páginas claras se distingue poco. `BrandMark.astro` recibe `inverted`, pero no utiliza esa propiedad para generar una variante.

**Impacto:** se debilita la identificación del alojamiento al entrar directamente a una ficha. **Solución:** probar una versión simplificada del sello o un nombre corto legible junto al símbolo; mejorar su separación del fondo. **Aceptación:** reconocer la marca en la cabecera de una ficha a 320 px sin desplazar ni reducir el área del menú. No atribuir automáticamente al logotipo las mismas reglas de contraste que al texto normal.

## 6. Diseño y elección de alojamiento — prioridad media

### UX-15 · La portada dedica más jerarquía a reiterar ubicación que a ayudar a elegir

**Evidencia:** dirección, kicker, bajada del H1 y párrafo repiten Capilla del Monte/alquiler temporario. La foto de fachada tiene desenfoque intenso en la parte inferior. En móvil aparecen a la vez el CTA del hero y el fijo, mientras “Conocé los departamentos” queda como microtexto.

**Evaluación:** la marca se reconoce, pero la propuesta podría ser más útil. **Solución:** conservar la composición editorial y hacer explícito “Cuatro departamentos para 2 a 5 personas”; priorizar un acceso claro a elegir unidad y mantener la consulta disponible. Reducir repetición y probar un tratamiento menos borroso de la fachada. **Aceptación:** en una prueba de cinco segundos, las personas identifican tipo de alojamiento, capacidad general, ubicación y siguiente acción. No prometer mejora de conversión sin medirla.

### UX-16 · Comparar cuatro departamentos exige recordar demasiada información

**Evidencia:** el home presenta cuatro filas grandes consecutivas; no existe un resumen paralelo de capacidad, dormitorios y restricciones. Las descripciones contienen diferencias reales, pero dispersas. El home midió aproximadamente 8.900 px de alto en la revisión móvil.

**Solución:** incorporar un resumen compacto de las cuatro opciones antes de las filas, o convertir la introducción en una comparación accesible. Para solo cuatro unidades, un buscador o filtros complejos serían innecesarios. **Aceptación:** elegir entre #2 y #3, ambos para tres personas, sin abrir cuatro pestañas; enlazar cada opción con su ficha y resaltar la distribución del baño del #3.

### UX-17 · Las fichas móviles muestran acciones desalineadas antes de la fotografía

**Evidencia:** en #1 a 390 px, título y resumen están a la izquierda; capacidad, video y WhatsApp se desplazan hacia la derecha en bloques distintos. La primera foto comienza después de una cabecera extensa. La barra fija repite la consulta.

**Causa:** `.title-side` y `.title-actions` mantienen alineación al extremo derecho al replegarse. **Solución:** una secuencia móvil clara: nombre → capacidad/camas → foto → diferencia importante → consulta; dejar video como acción secundaria. Mantener un CTA visible sin repetirlo innecesariamente en el mismo campo visual. **Aceptación:** ambas acciones alineadas con el contenido, sin huecos arbitrarios ni cambio brusco de alineación entre 390 y 720 px. **Referencia:** `src/pages/unidades/[slug].astro:90` y estilos correspondientes.

### UX-18 · El resumen de equipamiento no destaca bien lo diferencial y lo compartido

**Evidencia:** la ficha #4 describe lavarropas, pero no lo incluye en sus chips de servicios. “Parrilla” aparece como atributo de cada unidad aunque el patio y las dos parrillas son comunes. El home toma los primeros cuatro chips, no una selección explícita de atributos decisivos.

**Solución:** separar “Dentro del departamento” de “Espacios compartidos”; elegir atributos destacados por utilidad, no por posición en el array. **Aceptación:** el #4 muestra lavadero/lavarropas; parrillas y patio se entienden como compartidos; el equipamiento general no tapa diferencias de camas, cocina o baño. **Referencias:** contenido de unidades, `UnitRow.astro` y `ServiceList.astro`.

### UX-19 · “Todo incluido” genera una expectativa más amplia que el servicio real

**Evidencia:** el título de Servicios dice “Todo incluido”, pero después se enumeran desayuno y servicio de habitación entre lo que no se ofrece. La limpieza figura bajo “Lo que no tenemos”, aunque se incluye para estadías de más de siete noches.

**Solución:** titular “Qué incluye tu estadía” y separar incluido, condicionado y no disponible. Especificar “Limpieza durante la estadía” para no sugerir que el alojamiento se entrega sin limpiar. **Aceptación:** estacionamiento aparece condicionado; limpieza larga se explica sin contradicción de categorías; no se infiere una modalidad hotelera. **Referencia:** `src/pages/servicios.astro`, equivalente EN e i18n.

### UX-20 · Las condiciones de decisión están repartidas entre páginas y acordeones

**Evidencia:** seña del 20 %, medios de pago, cancelación, mascotas y horarios están en FAQ. Las fichas muestran una selección, pero el check-out y el estacionamiento no forman parte de esa selección. La consulta pide fechas, pero no sistematiza cantidad de personas y distribución de camas.

**Solución:** resumen “Antes de consultar” cerca de la acción: fechas y huéspedes a informar, check-in/out, seña, enlace a cancelación, mascotas y cochera sujetas a confirmación. Se puede resolver con texto y mensaje preparado, sin formulario de reserva. **Aceptación:** una persona entiende qué necesita enviar y qué queda pendiente de confirmación. No inventar tarifas ni disponibilidad; no es obligatorio publicar un precio fijo para este modelo.

## 7. Fotografías, galería y confianza — prioridad media

### UX-21 · La galería móvil demanda un recorrido muy largo

**Evidencia:** 40 fotos distribuidas en 9 de espacios comunes y 7/8/8/8 de unidades. A 390 × 844, el documento midió aproximadamente **16.706 px**. El índice funciona, pero sus cinco opciones no entran simultáneamente y la barra oculta el scrollbar.

**Solución:** conservar los accesos por unidad, hacer evidente que el índice se desliza y ofrecer una selección inicial con “Ver las 8 fotos”. Evitar que ver un departamento requiera recorrer todas las fotos previas. **Aceptación:** llegar al #4 de forma evidente, conservar enlaces profundos y acceso a todas las imágenes. La longitud por sí sola no demuestra abandono; es una hipótesis de esfuerzo a validar.

### UX-22 · La tira de fotos del home mezcla unidades sin identificarlas

**Evidencia:** `GalleryStrip.astro` combina patio, living del #4, cocina del #1 y dormitorio del #3. Los captions son “Living”, “Cocina”, “Dormitorio”; el grupo `home-strip` no aporta nombre de unidad al visor.

**Impacto:** puede parecer que esas comodidades pertenecen a un mismo departamento. **Solución:** añadir “Living · Departamento #4”, conservar ese contexto en el visor y enlazar la ficha correspondiente. **Aceptación:** cada interior permite identificar el departamento; los espacios comunes se distinguen de los privados. También mejora la atribución de consultas desde esa galería.

### UX-23 · Los captions largos ocupan demasiado de las miniaturas móviles

**Evidencia:** en el mosaico del #1, las etiquetas de dormitorio y cocina se parten en varias líneas dentro de pequeñas celdas cuadradas. Tienen mayúsculas, fondo oscuro y apenas 9,5 px; explican el ambiente mientras cubren parte de él.

**Solución:** usar captions cortos en miniatura —“Dormitorio · cama king”— y la descripción completa en el visor o debajo de la imagen. Reservar la quinta celda para una sola acción clara si confluyen caption, “+N fotos” y “Ver galería”. **Aceptación:** ninguna etiqueta tapa el elemento principal de la foto; la información completa sigue disponible y accesible. **Referencia:** `PhotoMosaic.astro`.

### UX-24 · El visor carece de un estado útil cuando falla una foto

**Evidencia:** en `Lightbox.astro:150–151`, tanto `load` como `error` solo eliminan el estado de carga. No hay texto de error ni reintento. El contador y caption se actualizan sin región de anuncio. El fallo de red no se simuló: hallazgo de código.

**Solución:** mensaje breve de error, reintento y navegación a otras imágenes; anunciar cambios de foto de manera moderada, sin sobrecargar al lector. **Aceptación:** una imagen que falla no deja un marco incomprensible y no bloquea cerrar/avanzar. Preservar el ciclo de foco y Atrás ya comprobados.

### UX-25 · Las reseñas funcionan, pero su presentación depende de un tercero

**Evidencia:** el widget cargó correctamente y mostró reseñas. No se considera roto. Visualmente agrega tarjetas blancas, azules y el texto “Free Booking Reviews Widget”, diferentes del sistema editorial. Si fallan ambas cargas de script, el código no reemplaza el espacio reservado de 420–520 px; sí permanece el enlace a Booking.

**Solución:** mantener una alternativa compacta con “Ver reseñas en Booking” si no carga; reducir el vacío reservado en fallo y armonizar el marco. Para retirar la marca del proveedor, usar una opción permitida por el servicio o cambiar de integración, sin ocultar atribuciones de forma indebida. **Aceptación:** con y sin widget hay contenido comprensible y salida útil; no inventar valoraciones ni testimonios. **Referencia:** `ReviewsBlock.astro`.

### UX-26 · El video saca al visitante a Drive sin preparar esa transición

**Evidencia:** los cuatro botones apuntan a archivos de Google Drive y abren otra pestaña; no informan duración ni destino. No se reprodujeron los cuatro videos ni se certificaron sus permisos públicos.

**Solución:** indicar “Ver recorrido en video · abre Google Drive”, duración cuando se conozca y miniatura si ayuda a decidir. Evaluar un reproductor integrado solo si puede mantenerse rápido y accesible. **Aceptación:** enlaces probados sin iniciar sesión en móvil y escritorio; la persona sabe que sale del sitio y puede volver. Conservar el video como apoyo, no como requisito para comprender la distribución. **Referencia:** `VideoCTA.astro` y `video_url` de las unidades.

## 8. Idiomas y transparencia — prioridad media

### UX-27 · Persisten elementos de interfaz en español dentro de EN

**Evidencia:** footer EN muestra “HECHO EN CAPILLA DEL MONTE”. En las reseñas aparecen “Reseñas”, “Leer más” y fechas en español dentro de `/en/`. En ES, la navegación accesible se etiqueta “Main navigation” y el selector “Language”.

**Solución:** localizar textos propios y configurar idioma del widget si lo permite. No traducir silenciosamente reseñas auténticas; indicar si se muestra original o traducción. **Aceptación:** controles, etiquetas accesibles y estados en el idioma de la ruta; originales de huéspedes diferenciados de la interfaz. **Referencias:** `Footer.astro`, `NavBar.astro`, `ReviewsBlock.astro`.

### UX-28 · La página no encontrada pierde el idioma inglés

**Evidencia:** visitar una URL inexistente bajo `/en/` mostró `lang="es"`, “Te perdiste” y enlaces de recuperación en español. La lógica de `404.astro` contiene dos idiomas, pero el sitio genera una página estática y ese resultado no cambia según la URL inexistente del visitante.

**Solución:** generar y enrutar una recuperación localizada, o una 404 bilingüe explícita si es más simple para este alojamiento. **Aceptación:** un enlace EN inválido conserva una salida comprensible a EN y no propone un cambio invisible de idioma. Verificar también el estado HTTP de error al implementar; esta sesión comprobó el contenido mostrado.

### UX-29 · Cambiar de idioma conserva la página, pero no la sección

**Evidencia:** `otherLangPath` recibe `Astro.url.pathname` en la navegación. El fragmento no se incorpora al enlace; desde `/galeria/#unidad-4` el cambio apunta a la galería EN sin ese ancla. Hallazgo comprobado en código y estructura de enlaces.

**Solución:** conservar el fragmento cuando existe un destino equivalente, especialmente en galería y categorías FAQ. **Aceptación:** pasar de ES a EN mantiene el departamento o categoría seleccionados; si no existe equivalente, llevar al inicio con una salida clara. No exigir slugs ingleses para solucionar este problema: las rutas actuales son utilizables.

### UX-30 · Falta información visible sobre el uso de datos y servicios externos

**Evidencia:** `Base.astro` carga GA4 y analítica de Vercel; hay mapas y reseñas de terceros. El footer no ofrece una página informativa de privacidad o una explicación del tratamiento de consultas.

**Solución:** publicar información real sobre quién gestiona el sitio, qué se mide, qué ocurre al abrir WhatsApp y qué proveedores intervienen. Relevar cookies y configuración efectiva antes de decidir si hace falta un mecanismo de consentimiento y cómo debe funcionar.

**Aceptación:** enlace accesible desde todas las páginas; texto fiel a la implementación y proceso del negocio. Este es un hallazgo de transparencia UX, no una conclusión legal ni una afirmación de incumplimiento de una jurisdicción.

## 9. Ajustes de prioridad baja

### UX-31 · Algunas declaraciones de tamaño de imagen no coinciden con la grilla

**Evidencia de código:** `GalleryStrip.astro` declara `33vw` hasta 900 px, pero bajo 480 px pasa a dos columnas, cercanas a `50vw`. `PhotoMosaic.astro` declara `100vw` para todas las fotos bajo 900 px aunque varias celdas móviles ocupan media fila. En galería, la celda principal ocupa dos columnas pero comparte declaración con celdas menores.

**Impacto potencial:** el navegador puede elegir una imagen de menor nitidez o descargar una variante mayor de lo necesario; no se midió aquí el ahorro ni la transferencia real.

**Solución y aceptación:** alinear `sizes` con cada tipo de celda y breakpoint; comparar recurso elegido, nitidez y bytes en una prueba de red antes/después. No reemplazar la optimización WebP existente ni cambiar la política de fuentes sin evidencia nueva.

### UX-32 · Datos orientativos y afirmaciones de lugares cercanos carecen de contexto editorial

**Evidencia:** Ubicación muestra temperaturas “28° / 16°” sin explicar escala, máximas/mínimas ni período de referencia. “Mejor puntuados”, “La mejor época” y algunas afirmaciones sobre lugares no incluyen fuente ni fecha. Los puntos cercanos no son enlaces para ampliar información.

**Solución:** distinguir orientación de pronóstico, indicar °C y qué representan los valores, fechar la revisión de recomendaciones y dar salidas a información verificable. Sustituir superlativos por descripciones concretas si no se mantienen fuentes. **Aceptación:** el lector entiende qué es aproximado y puede verificar el destino. No se declara que las cifras o lugares sean falsos: su exactitud externa no fue auditada.

## 10. Propuesta de experiencia objetivo

### Inicio

1. Portada con marca, tipo de alojamiento, rango de huéspedes y ubicación expresados sin reiteraciones.
2. Resumen comparativo de las cuatro unidades y acceso a sus fichas.
3. Presentación fotográfica de cada unidad, con diferencias verificables.
4. Espacios comunes y servicios agrupados de forma clara.
5. Prueba de confianza compacta y contextual, sin depender completamente del widget.
6. Ubicación, condiciones esenciales y preguntas frecuentes.
7. Consulta con fechas, huéspedes y unidad como guía.

Se puede mantener la numeración editorial actual. La numeración de secciones del home y la de páginas internas responde a órdenes distintos documentados por el proyecto; no se trata como bug ni se propone unificarlas automáticamente.

### Comparación sugerida con contenido existente

| Unidad | Huéspedes | Distribución | Diferencia importante |
|---|---:|---|---|
| #1 · 40 m² | Hasta 2 | Un dormitorio; king o dos individuales | Cocina eléctrica sin horno |
| #2 · 40 m² | Hasta 3 | Queen en dormitorio; individual en cocina/comedor | Horno a gas; aclarar ubicación de la tercera cama |
| #3 · 60 m² | Hasta 3 | Dos dormitorios, queen e individual | Acceso al baño por el dormitorio principal |
| #4 · 65 m² | Hasta 5 | Tres dormitorios y un baño | Lavadero con lavarropas; dos habitaciones con aire |

Este resumen reutiliza datos actuales. Antes de publicarlo como contenido revisado, el responsable del alojamiento debe confirmar equipamiento, distribución y condiciones vigentes.

### Ficha de departamento

- Mantener nombre y número reconocibles; acompañarlos de capacidad, camas y diferencia principal.
- Adelantar la evidencia fotográfica y simplificar la colocación de video/consulta.
- Mostrar servicios privados y compartidos por separado.
- Incluir las restricciones relevantes antes de consultar, no solo dentro de FAQ.
- Mantener enlaces a otros departamentos para recuperar una elección que no encaja.
- Preservar unidad e idioma en todos los puntos de consulta, incluida la barra fija.

### Criterios visuales

- Conservar papel/tinta/terracota, fotografías y tipografías del proyecto.
- Usar el terracota más oscuro donde deba sostener texto pequeño claro.
- Reducir la diferencia excesiva entre números de gran tamaño y especificaciones minúsculas.
- Alinear bloques por su función: títulos, datos, fotos y acciones con una progresión clara.
- Evitar añadir animaciones o adornos para compensar problemas de jerarquía.
- No introducir carruseles obligatorios, formularios largos ni funcionalidades ajenas al modelo de consulta directa.

## 11. Plan de resolución

Los esfuerzos siguientes son orientativos, incluyen implementación y comprobación local, y dependen de acceso al entorno y decisiones de contenido. No son un presupuesto cerrado.

| Orden | Trabajo | Hallazgos | Esfuerzo orientativo | Dependencia |
|---|---|---|---|---|
| 1 | Corregir menú: color, foco, altura y resize | 01, 02, 07, 12 | 1–2 jornadas | Ninguna decisión comercial |
| 2 | Corregir mapa y grilla de Servicios | 03, 08 | 0,5–1 jornada | Verificación en ES/EN |
| 3 | Ajustar contraste y aparición progresiva | 04, 06 | 0,5–1,5 jornadas | Validación visual y sin JS |
| 4 | Preservar contexto de consulta | 05 | 0,5–1,5 jornadas | Cuenta/enlace WhatsApp verificado |
| 5 | Orientación, teclado e idiomas | 09–11, 27–29 | 1–2 jornadas | Definir 404 localizada |
| 6 | Comparación, fichas y tipografía | 13–20 | 2–4 jornadas | Confirmación de contenido y revisión de diseño |
| 7 | Galería, fotos, errores y reseñas | 21–26, 31 | 1,5–3 jornadas | Opciones del proveedor y permisos de videos |
| 8 | Transparencia y datos editoriales | 30, 32 | 0,5–1 jornada de interfaz | Contenido validado por el negocio |

Conviene entregar estos bloques por separado. No hace falta esperar un rediseño completo para corregir los problemas de móvil y consulta. El despliegue deberá comprobarse en el sitio publicado; este informe no modifica ni publica el sitio.

## 12. Validación de las mejoras

### Recorridos de aceptación

| Tarea | Resultado esperado |
|---|---|
| Soy dos personas y necesitamos camas separadas | Identificar #1 y entender que se solicita esa configuración |
| Somos tres y queremos dos dormitorios | Comparar #2/#3 y comprender el acceso al baño del #3 |
| Somos cinco y necesitamos lavar ropa | Identificar #4 y confirmar cinco plazas y lavarropas |
| Viajo con mascota y auto | Detectar que mascota y cochera requieren confirmación |
| Consulto desde la foto de una unidad | WhatsApp conserva la unidad correspondiente |
| No conozco la zona | Leer dirección y abrir indicaciones sin que el mapa tape controles |
| Uso solo teclado | Menú y visor mantienen orden, cierre y retorno de foco |
| Navego en inglés | Mantener idioma, sección y recuperación ante un enlace inválido |
| Falla una imagen, el widget o JavaScript | Ver contenido base y una salida útil; no encontrar huecos inexplicables |

### Matriz mínima para implementar

- Anchos 320, 360/390, 768, 900, 901, 1024, 1280 y 1440; orientación horizontal con poca altura.
- Chrome/Android y Safari/iOS reales o dispositivos equivalentes; escritorio con teclado.
- Zoom de navegador 200/400 %, aumento de texto, movimiento reducido y foco no oculto por barras fijas.
- Menú abierto al cambiar tamaño, Escape, Atrás, regreso desde WhatsApp/Drive y cambio ES/EN.
- Imágenes y widget fallidos; contenido con scripts bloqueados; red móvil limitada.
- Contraste calculado de estado normal, hover y foco; revisión de lector de pantalla en navegación y visor.
- Build de producción y pruebas de enlaces después de corregir el entorno local.

Estas comprobaciones son criterios de cierre futuros; no se presentan como ya ejecutadas.

## 13. Cómo medir si realmente mejora

**No usar clics de WhatsApp como equivalente a reservas.** El evento actual mide intención de contacto. Mantenerlo y observar por separado: visita a ficha, clic a WhatsApp, consulta efectivamente recibida y reserva confirmada mediante un proceso operativo adecuado.

Medir antes/después con períodos comparables y suficiente volumen, segmentando por dispositivo, idioma y departamento. Evitar atribuir cambios a la interfaz si cambian a la vez temporada, campañas o disponibilidad.

Indicadores útiles:

- Proporción de consultas que ya incluyen unidad, fechas y cantidad de huéspedes.
- Número de mensajes adicionales necesarios para poder cotizar.
- Frecuencia de dudas repetidas sobre camas, baño, mascotas y cochera.
- Capacidad de elegir entre #2/#3 sin ayuda en una prueba breve con potenciales huéspedes.
- Errores de navegación y recuperación en menú, mapa y galería.
- Clics a fichas y WhatsApp por ubicación del botón; mantener datos personales fuera de la analítica.
- Rendimiento real posterior a cambios de imagen o widgets. No se reutilizan como resultados actuales las mediciones históricas de septiembre.

La mejora esperada es una elección más clara y consultas mejor informadas. Su magnitud debe comprobarse con datos y usuarios; esta auditoría entrega evidencia reproducible y criterios para hacerlo.
