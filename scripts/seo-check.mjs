// Chequeo SEO del build estático. Correr después de `npm run build`: `npm run seo:check`.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const SITE = 'https://refugiodelcorazon.com.ar';
// El adapter de Vercel escribe el build acá; `dist/` puede quedar con un build viejo.
const DIST = existsSync('.vercel/output/static') ? '.vercel/output/static' : 'dist';
const errors = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith('.html') ? [join(dir, e.name)] : []);
}

const attr = (html, re) => html.match(re)?.[1];
const titles = new Map();
const descs = new Map();
const pages = walk(DIST);

for (const file of pages) {
  const rel = relative(DIST, file).split(sep).join('/');
  const is404 = rel === '404.html';
  const route = '/' + rel.replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');

  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  if (is404) {
    if (!robots?.includes('noindex')) fail(rel, '404 sin noindex');
    continue;
  }
  if (!robots || robots.includes('noindex')) fail(route, `robots inesperado: ${robots}`);

  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  if (canonical !== SITE + route) fail(route, `canonical ${canonical} ≠ ${SITE + route}`);

  const title = attr(html, /<title>([^<]*)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  if (!title) fail(route, 'sin <title>');
  if (!desc) fail(route, 'sin meta description');
  if (titles.has(title)) fail(route, `title duplicado con ${titles.get(title)}`);
  if (descs.has(desc)) fail(route, `description duplicada con ${descs.get(desc)}`);
  titles.set(title, route);
  descs.set(desc, route);

  const hreflangs = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
  for (const code of ['es', 'en', 'x-default']) {
    const h = hreflangs.find(m => m[1] === code);
    if (!h) fail(route, `falta hreflang ${code}`);
    else if (!existsSync(join(DIST, h[2].replace(SITE, ''), 'index.html'))) fail(route, `hreflang ${code} apunta a página inexistente: ${h[2]}`);
  }

  if (!html.includes('<h1')) fail(route, 'sin <h1>');

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let data;
    try { data = JSON.parse(json); } catch { fail(route, 'JSON-LD inválido'); continue; }
    const urls = JSON.stringify(data).match(/https:\/\/refugiodelcorazon\.com\.ar[^"]*/g) ?? [];
    for (const u of urls) if (/#[^"]*\/$/.test(u)) fail(route, `URL con fragmento y barra final: ${u}`);
  }

  const preload = attr(html, /<link rel="preload" as="image" href="([^"]*)"/);
  if (preload && !html.replace(/<link rel="preload"[^>]*>/, '').includes(preload)) {
    fail(route, `preload de imagen que la página no usa: ${preload}`);
  }
}

const sitemap = readdirSync(DIST).filter(f => /^sitemap-\d+\.xml$/.test(f))
  .map(f => readFileSync(join(DIST, f), 'utf8')).join('');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!locs.length) fail('sitemap', 'sin URLs');
for (const loc of locs) {
  if (loc.includes('404')) fail('sitemap', `incluye ${loc}`);
  if (!existsSync(join(DIST, loc.replace(SITE, ''), 'index.html'))) fail('sitemap', `URL sin página: ${loc}`);
}
if (locs.length !== pages.length - 1) fail('sitemap', `${locs.length} URLs vs ${pages.length - 1} páginas indexables`);

if (errors.length) {
  console.error(`✗ ${errors.length} problemas SEO:\n` + errors.map(e => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(`✓ SEO OK — ${pages.length - 1} páginas indexables + 404, ${locs.length} URLs en sitemap`);
