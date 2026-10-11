// Run after npm run build. Uses an isolated browser; never opens WhatsApp or sends data.
// PLAYWRIGHT_MODULE may point to a preinstalled Playwright package outside this repo.
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import assert from 'node:assert/strict';

const require = createRequire(import.meta.url);
const playwright = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const engine = process.env.QA_BROWSER_ENGINE || 'chromium';
const root = resolve('.vercel/output/static');
const output = resolve('docs/ux-ui/evidencias', engine);
await mkdir(output, { recursive: true });
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' }).end(bytes);
  } catch { res.writeHead(404, { 'Content-Type': 'text/html' }).end(await readFile(join(root, '404.html'))); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await playwright[engine].launch({ headless: true, ...(engine === 'chromium' ? { channel: process.env.QA_BROWSER_CHANNEL || (process.platform === 'win32' ? 'msedge' : undefined) } : {}) });
const report = { date: new Date().toISOString(), engine, browser: await browser.version(), matrix: [], checks: [], errors: [], limitations: ['Viewport reflow at 640/320 CSS px approximates 200/400% zoom on a 1280px display; it is not native browser zoom.', 'No physical iOS/Android device or screen reader is controlled by this test.'] };
const test = async (name, fn) => {
  if (process.env.QA_ONLY && !new RegExp(process.env.QA_ONLY).test(name)) return;
  try { const detail = await fn(); report.checks.push({ name, ok: true, detail }); console.log(`PASS ${name}`); }
  catch (error) { report.checks.push({ name, ok: false, error: error.stack }); console.log(`FAIL ${name}: ${error.stack}`); }
};
const context = async (options = {}, external = false, imageDelay = 0) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-AR', reducedMotion: 'reduce', ...options });
  await ctx.route('**/*', async route => {
    const url = route.request().url();
    if (imageDelay && route.request().resourceType() === 'image') await new Promise(r => setTimeout(r, imageDelay));
    if (url.startsWith(base) || (external && /https:\/\/[^/]*(elfsight|eapps)[^/]*\//.test(url))) return route.continue();
    return route.abort();
  });
  return ctx;
};
const settle = async page => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(80); };
const overflow = page => page.evaluate(() => ({ width: innerWidth, client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
const shot = async (page, name, fullPage = false) => {
  // Load offscreen photos for complete evidence, not for performance measurement.
  if (fullPage) await page.evaluate(async () => {
    const images = [...document.images].filter(img => img.getClientRects().length && img.getAttribute('src'));
    images.forEach(img => { img.loading = 'eager'; });
    await Promise.all(images.map(img => img.decode().catch(() => {})));
  });
  await settle(page);
  await page.screenshot({ path: join(output, name + '.png'), fullPage });
};

try {
  const ctx = await context();
  const page = await ctx.newPage();
  page.on('pageerror', e => report.errors.push(e.message));
  const routes = [];
  async function find(dir, prefix = '/') {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !['_astro', 'og'].includes(entry.name)) await find(join(dir, entry.name), prefix + entry.name + '/');
      else if (entry.name === 'index.html') routes.push(prefix);
    }
  }
  await find(root);
  routes.push('/404.html');
  for (const width of (process.env.QA_ONLY ? [] : [320, 390, 640, 768, 900, 901, 1280, 1440])) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await page.goto(base + path, { waitUntil: 'load' });
      await settle(page);
      const bounds = await overflow(page);
      report.matrix.push({ path, ...bounds, ok: bounds.scroll <= bounds.client + 1 && bounds.width === width });
    }
    console.log(`Matrix ${width}px: ${routes.length} pages`);
  }
  await test('Responsive: all pages at eight widths', () => assert.deepEqual(report.matrix.filter(x => !x.ok), []));
  await test('Skip link by keyboard', async () => {
    await page.goto(base + '/servicios/');
    await page.keyboard.press('Tab');
    assert.equal(await page.locator('.skip-link').evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'contenido');
  });
  await test('Mobile menu: focus, tab confinement, Escape and breakpoint', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/');
    await page.locator('[data-burger]').click();
    assert.equal(await page.locator('[data-menu-close]').evaluate(el => el === document.activeElement), true);
    for (let i = 0; i < 16; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => document.activeElement === document.body || !!document.activeElement.closest('dialog')), true);
    }
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('dialog').open);
    assert.equal(await page.locator('[data-burger]').evaluate(el => el === document.activeElement), true);
    await page.setViewportSize({ width: 844, height: 390 });
    await page.locator('[data-burger]').click();
    assert.equal(await page.locator('dialog').evaluate(el => el.scrollHeight > el.clientHeight), true);
    await shot(page, 'menu-horizontal');
    await page.setViewportSize({ width: 901, height: 900 });
    await page.waitForFunction(() => !document.querySelector('dialog').open && document.body.style.overflow === '');
  });
  await test('Lightbox: navigation, focus, history Back and small landscape', async () => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto(base + '/galeria/');
    const trigger = page.locator('[data-lb-group="unit-4"]').first();
    await trigger.click();
    await page.waitForFunction(() => document.querySelector('.lb-img').naturalWidth > 0);
    await page.locator('.lb-next').click();
    assert.match(await page.locator('.lb-counter').innerText(), /2 \/ 8/);
    assert.match(decodeURIComponent(await page.locator('.lb-wa').getAttribute('href')), /#4/);
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(() => !!document.activeElement.closest('#lightbox')), true);
    }
    const bounds = await page.locator('.lb-meta').boundingBox();
    const cta = await page.locator('.lb-wa').boundingBox();
    await shot(page, 'visor-horizontal');
    assert.ok(bounds.y + bounds.height <= cta.y, `Caption ends ${bounds.y + bounds.height}; CTA begins ${cta.y}`);
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('#lightbox').getAttribute('aria-hidden') === 'true');
    assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  });
  await test('Image failure and successful retry', async () => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + '/en/galeria/');
    const trigger = page.locator('[data-lb-group="unit-4"]').first();
    const imageURL = new URL(await trigger.getAttribute('data-lb-sm'), base).href;
    await page.route(imageURL, route => route.abort());
    await trigger.click();
    await page.locator('.lb-error').waitFor({ state: 'visible' });
    assert.match(await page.locator('.lb-error').innerText(), /could not be loaded/);
    await page.unroute(imageURL);
    await page.locator('.lb-retry').click();
    await page.waitForFunction(() => document.querySelector('.lb-error').hidden && document.querySelector('.lb-img').naturalWidth > 0);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.querySelector('#lightbox').getAttribute('aria-hidden') === 'true');
  });
  await test('Language preserves gallery fragment', async () => {
    await page.goto(base + '/galeria/#unidad-3');
    await page.locator('[data-burger]').click();
    await page.locator('dialog [data-switch-lang="en"]').click();
    await page.waitForURL('**/en/galeria/#unidad-3');
    assert.match(await page.locator('#unidad-3 h2').innerText(), /Apartment #3/);
  });
  await test('No JavaScript: navigation, FAQ and gallery remain usable', async () => {
    const nojs = await context({ javaScriptEnabled: false });
    const p = await nojs.newPage();
    await p.goto(base + '/faq/');
    assert.equal(await p.locator('.nav-fallback').isVisible(), true);
    assert.equal(await p.locator('[data-burger]').isVisible(), false);
    const detail = p.locator('.faq-item').first();
    if (await detail.getAttribute('open') === null) await detail.locator('summary').click();
    assert.equal(await detail.locator('.faq-a').isVisible(), true);
    await p.goto(base + '/galeria/');
    await p.locator('.gal-more').first().locator('summary').click();
    assert.equal(await p.locator('.gal-more').first().getAttribute('open'), '');
    await p.locator('[data-lb-group]').first().click();
    assert.ok(!p.url().includes('/galeria/'));
    await p.goto(base + '/');
    assert.equal(await p.locator('.reviews-load').isVisible(), false);
    assert.equal(await p.locator('.reviews a').isVisible(), true);
    await shot(p, 'inicio-sin-javascript');
    await nojs.close();
  });
  await test('Reviews: blocked provider exposes Booking fallback', async () => {
    await page.goto(base + '/');
    await page.locator('.reviews-load').click();
    await page.waitForFunction(() => document.querySelector('.reviews-status').textContent.includes('Si el panel'));
    assert.equal(await page.locator('.reviews a').isVisible(), true);
    await page.locator('.reviews').screenshot({ path: join(output, 'resenas-error.png') });
  });
  await test('Slow images: menu and inquiry link work while loading', async () => {
    const slow = await context({}, false, 1800);
    const p = await slow.newPage();
    await p.goto(base + '/unidades/unidad-4/', { waitUntil: 'domcontentloaded' });
    await p.locator('[data-burger]').click();
    assert.equal(await p.locator('dialog').evaluate(el => el.open), true);
    assert.match(decodeURIComponent(await p.locator('dialog a[href*="wa.me"]').getAttribute('href')), /#4/);
    await p.keyboard.press('Escape');
    await p.waitForLoadState('load');
    await slow.unrouteAll({ behavior: 'wait' });
    await slow.close();
  });
  await test('Final screenshots', async () => {
    for (const [path, width, height, name] of [['/',1440,1000,'inicio-escritorio'],['/servicios/',901,900,'servicios-901'],['/unidades/unidad-4/',390,844,'unidad-4-movil'],['/galeria/',320,844,'galeria-320'],['/ubicacion/',390,844,'ubicacion-movil']]) {
      await page.setViewportSize({ width, height });
      await page.goto(base + path);
      await shot(page, name + '-viewport');
      await shot(page, name, true);
    }
  });
  await test('Reviews: live provider (only Elfsight network allowed)', async () => {
    const live = await context({}, true);
    const p = await live.newPage();
    const requests = [];
    p.on('response', response => { if (/elfsight|eapps/.test(response.url())) requests.push({ url: response.url().split('?')[0], status: response.status() }); });
    await p.goto(base + '/');
    assert.equal(requests.length, 0);
    await p.locator('.reviews-load').click();
    await p.waitForTimeout(18000);
    const state = await p.locator('.reviews').innerText();
    await p.locator('.reviews').screenshot({ path: join(output, 'resenas-proveedor.png') });
    const detail = { requests, text: state, frameHeight: await p.locator('.widget-frame').evaluate(el => el.offsetHeight), status: await p.locator('.reviews-status').innerText() };
    await live.close();
    assert.ok(!state.includes('Cargando reseñas'), 'Provider must not stay in loading state');
    if (state.includes('Leer más')) assert.equal(detail.status, '', 'Loaded reviews must clear our fallback/loading message');
    return detail;
  });
  await test('No uncaught application errors', () => assert.deepEqual(report.errors, []));
  await ctx.close();
} finally {
  await writeFile(join(output, process.env.QA_ONLY ? 'browser-qa-focused.json' : 'browser-qa.json'), JSON.stringify(report, null, 2) + '\n');
  await browser.close();
  server.close();
}
if (report.checks.some(x => !x.ok)) process.exitCode = 1;
