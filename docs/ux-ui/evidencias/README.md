# Evidencias de navegador — 10 de octubre de 2026

Las carpetas `chromium` y `webkit` contienen capturas y resultados de una sesión aislada sobre el sitio construido localmente. Los archivos `browser-qa.json` registran la matriz de páginas, ancho realmente observado, desbordamiento e interacciones. `browser-qa-focused.json`, cuando existe, registra una comprobación posterior y específica.

## Capturas principales

- [Inicio de escritorio](chromium/inicio-escritorio-viewport.png)
- [Departamento #4 en móvil](chromium/unidad-4-movil-viewport.png)
- [Servicios a 901 px](chromium/servicios-901.png)
- [Galería a 320 px](chromium/galeria-320.png)
- [Visor en horizontal](chromium/visor-horizontal.png)
- [Reseñas reales cargadas](chromium/resenas-proveedor.png)
- [Reseñas con proveedor bloqueado](chromium/resenas-error.png)
- [Inicio sin JavaScript](chromium/inicio-sin-javascript.png)

Las capturas largas cargan también las imágenes fuera de pantalla para que se pueda revisar el contenido completo. No sirven como medición de velocidad. Los elementos fijos aparecen en la posición del primer viewport en esas capturas.

## Reproducir

1. Construir el sitio con `npm run build` y la configuración habitual del proyecto.
2. Tener Playwright disponible; se puede usar una instalación externa indicando su ruta con `PLAYWRIGHT_MODULE`. No se agregó una dependencia de producción. La ampliación del 11 de octubre añade `axe-core` como dependencia de desarrollo y actualiza el lockfile.
3. Ejecutar `npm run ux:browser`. En Windows utiliza Edge/Chromium instalado. `QA_BROWSER_CHANNEL` permite elegir otro canal compatible instalado.
4. Para WebKit, instalar el navegador de pruebas de Playwright y usar `QA_BROWSER_ENGINE=webkit`.
5. Opcionalmente, `QA_ONLY` acepta una expresión regular sobre los nombres de casos, por ejemplo `Lightbox|Final screenshots`. Esa ejecución guarda un informe separado y no sustituye la matriz completa.

El comando inicia y cierra su propio servidor local. Bloquea recursos externos durante las comprobaciones generales; en el caso del proveedor real solo habilita los dominios de Elfsight. No abre WhatsApp ni envía mensajes, formularios o eventos a los servicios de medición. Por ello, los mapas externos no quedan validados por esta suite.

WebKit en Windows verifica compatibilidad del motor; no equivale a una prueba de Safari en un iPhone físico. La suite `ux:browser` comprueba redistribución con anchos de 640 y 320 px sin accionar el zoom. Desde el 11 de octubre, `npm run ux:a11y` comprueba también el **zoom nativo** con Chromium de Playwright y registra sus resultados en `accesibilidad/`. Ver [informe de accesibilidad](../ACCESIBILIDAD-2026-10-11.md) para resultados, capturas y límites.
