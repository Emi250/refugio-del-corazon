# Accesibilidad y zoom — 11 de octubre de 2026

Continuación de la auditoría UX/UI sobre el sitio local en español e inglés. Se añadieron comprobaciones con axe-core y zoom nativo de Chromium, y se corrigieron los problemas reproducidos. Esto no equivale a una certificación de accesibilidad ni sustituye la experiencia con un lector de pantalla real.

## Cambios

| Problema observado | Corrección |
|---|---|
| Números pequeños del pie y del índice activo con contraste 4,34:1 sobre tinta | Nuevo color `--mf-accent-on-ink: #DC8A70`, con contraste 6,56:1 sobre `#1B1A16`. Se conserva la terracota original para usos decorativos. |
| Datos de capacidad del pie con contraste 3,49:1 al pasar el cursor | El texto secundario conserva su color claro en ese estado. |
| Enlace a la galería con contraste 3,52:1 al pasar el cursor | Usa `--mf-action`. El mismo ajuste se aplica a enlaces equivalentes de servicios, otras unidades y migas de navegación, en ES/EN. |
| Navegación clara sobre fondo claro cuando aparece la sugerencia de idioma en inicio | Fondo tinta bajo la navegación mientras la sugerencia está visible y la página permanece arriba. |
| Nombre del alojamiento anunciado dos veces en cada enlace de marca | El logo es decorativo cuando está acompañado del nombre visible. El componente conserva texto alternativo para un eventual uso independiente. |
| Etiquetas visibles como «Patio» o «Vista general» ausentes del nombre accesible | Los nombres de enlaces del índice y del mosaico incluyen su texto visible, además del contexto de la foto/unidad. |
| Sugerencia de idioma y consulta fija fuera de regiones identificadas | Se usan regiones complementarias con nombres localizados; la sugerencia declara el idioma de su contenido. |
| Salto de H1 a H3 en ubicación | La dirección pasa a H2, conservando su estilo visual. |
| Nombre ARIA aplicado a un contenedor genérico de comparación | La comparación se identifica como una sección con nombre. |

## Pruebas y evidencias

Resultado final: **53 análisis axe-core sin infracciones detectadas**, 42 casos de zoom nativo aprobados, cuatro comprobaciones de controles ampliados aprobadas y 42 casos de espaciado sin desbordamiento horizontal. Se mantienen registrados los resultados `incomplete` que requieren revisión manual; no se convierten en aprobaciones. Las seis comprobaciones seleccionadas de regresión en WebKit también aprobaron.

- **axe-core:** las 21 páginas a 390 y 1280 px; menú y visor abiertos; nueve estados de enlaces al pasar el cursor. Se incluyen reglas A/AA de WCAG 2, 2.1 y 2.2 disponibles en la herramienta, además de sus buenas prácticas.
- **Zoom nativo:** las 21 páginas al 200 % y 400 %, con una ventana inicial de 1280 × 960. El navegador devuelve el factor aplicado y se comprueban `innerWidth`, altura, densidad y ancho desplazable. También se comprueba el acceso a la consulta del menú y que descripción, cierre y consulta del visor no se superpongan.
- **Espaciado:** las 21 páginas a 390 y 1280 px con interlineado 1,5, separación entre letras 0,12 em, entre palabras 0,16 em y entre párrafos 2 em. Se verifica el ancho del documento; no se presenta como una garantía automática contra todo posible recorte de texto.
- **Regresión en WebKit:** salto al contenido, menú, visor, idioma, navegación sin JavaScript y capturas.

El [informe JSON final](./evidencias/accesibilidad/accessibility-qa.json) contiene resultados y casos que requieren revisión manual. El [registro inicial](./evidencias/accesibilidad/accessibility-before.json) conserva los problemas previos; esa primera ejecución se interrumpió por una comparación demasiado estricta del factor 4, que el navegador devolvía como `3.9999999999999996`. La prueba usa ahora una tolerancia numérica pequeña.

Capturas del zoom real:

- [Departamento #4 al 200 %](./evidencias/accesibilidad/unidad-4-zoom-200.png)
- [Departamento #4 al 400 %](./evidencias/accesibilidad/unidad-4-zoom-400.png)
- [Visor al 400 %](./evidencias/accesibilidad/visor-zoom-400.png)

Se usa una extensión mínima, sin permisos de lectura ni acceso a red, dentro de un perfil temporal de Chromium. Controla el zoom con la [API oficial de pestañas](https://developer.chrome.com/docs/extensions/reference/api/tabs#method-setZoom), siguiendo el [método de extensiones de Playwright](https://playwright.dev/docs/chrome-extensions). No se modifica el perfil personal del usuario. Las capturas usan directamente el viewport del compositor para evitar errores de recorte al combinar desplazamiento y zoom nativo.

Reproducción: `npm run build` y `npm run ux:a11y`, con Playwright disponible mediante `PLAYWRIGHT_MODULE` y su Chromium instalado. `axe-core` es una dependencia de desarrollo; no se envía al sitio publicado.

## Comprobaciones manuales restantes

| Entorno | Recorrido y resultado esperado |
|---|---|
| VoiceOver o TalkBack en un teléfono real | Recorrer inicio, comparación, ficha #4 y FAQ. Escuchar títulos, enlaces y estado abierto/cerrado de las preguntas; confirmar que el nombre del alojamiento no se repite dentro de cada enlace de marca. |
| Menú y visor con lector de pantalla | Abrir, recorrer controles y cerrar. El fondo debe quedar fuera del recorrido mientras el modal está abierto y el foco debe regresar al control que lo abrió. |
| Safari en iPhone y Chrome en Android | Revisar vertical/horizontal, barras del navegador y área segura inferior. Confirmar que cierre y consulta permanecen utilizables. |
| Regreso desde WhatsApp | Abrir una consulta de la ficha #4 sin enviarla, volver al sitio y comprobar unidad, posición y respuesta del menú. Repetir desde el visor. |
| Contenido externo y lectura sobre fotografías | Revisar el mapa y la reproducción de videos en el dispositivo; comprobar legibilidad sobre las fotografías. axe-core marca estos casos como revisión manual cuando no puede resolver el fondo o el iframe. |

Estas comprobaciones necesitan un dispositivo con acceso al sitio. No se ejecutaron por simulación ni se marcaron como aprobadas. El sitio se publicó el 11 de octubre (PR #11 y #12). El usuario decidió posponer las pruebas con teléfonos físicos y lectores de pantalla reales; permanecen pendientes.
