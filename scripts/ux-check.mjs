// Validate navigation and inquiry contracts against actual generated HTML.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import assert from 'node:assert/strict';
const root = '.vercel/output/static';
const walk = dir => readdirSync(dir, {withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(join(dir,e.name)) : e.name.endsWith('.html') ? [join(dir,e.name)] : []);
const pages = walk(root);
const decode = s => s.replaceAll('&amp;','&').replaceAll('&#39;',"'").replaceAll('&quot;','"');
const attr = (tag,key) => decode(tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1] ?? '');
let links = 0;
for (const file of pages) {
  const route = '/' + relative(root,file).split(sep).join('/').replace(/index\.html$/,'');
  const html = readFileSync(file,'utf8');
  assert.ok(html.includes('id="contenido"'), `${route}: skip destination`);
  for (const [tag] of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attr(tag,'href');
    if (!href) continue;
    if (href.startsWith('/') || href.startsWith('#')) {
      const url = new URL(href,`https://local.test${route}`);
      const target = join(root,url.pathname.endsWith('/') ? url.pathname+'index.html' : url.pathname);
      assert.ok(existsSync(target), `${route}: missing link ${href}`);
      if (url.hash && target.endsWith('.html')) {
        assert.ok(readFileSync(target,'utf8').includes(`id="${decodeURIComponent(url.hash.slice(1))}"`),`${route}: missing anchor ${href}`);
      }
      links++;
    }
    if (href.startsWith('https://wa.me/')) {
      const url = new URL(href);
      assert.match(url.pathname,/^\/[1-9]\d{7,14}$/);
      const message = url.searchParams.get('text');
      assert.ok(message, `${route}: missing inquiry`);
      const unit = route.match(/unidad-(\d+)/)?.[1];
      if (unit) assert.ok(message.includes(`#${unit}`), `${route}: lost unit context`);
      assert.match(message, route.startsWith('/en/') ? /^(Hi|Hello),/ : /^Hola[,]/, `${route}: lost language`);
    }
  }
  if (/\/(en\/)?galeria\/$/.test(route)) {
    assert.equal([...html.matchAll(/<a\b[^>]*data-lb-group=/g)].length,40,`${route}: all photos retained`);
    assert.equal([...html.matchAll(/<details\b/g)].length,5,`${route}: expandable groups`);
    if (route.startsWith('/en/')) assert.ok(!html.includes('data-lb-title="Departamento'), 'English photo titles');
  }
}
console.log(`UX OK: ${pages.length} pages, ${links} internal links, inquiry context and 40 photos per language.`);
