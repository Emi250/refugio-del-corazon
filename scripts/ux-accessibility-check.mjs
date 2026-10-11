import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, join, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const axe = require('axe-core');
const root = resolve('.vercel/output/static');
const output = resolve('docs/ux-ui/evidencias/accesibilidad');
await mkdir(output, { recursive: true });
const mime = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript', '.webp':'image/webp', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.woff2':'font/woff2' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.end(); }
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const base = `http://127.0.0.1:${server.address().port}`;
const extension = resolve('scripts/fixtures/zoom-extension');
const context = await chromium.launchPersistentContext('', {
  channel:'chromium', headless:true, viewport:{width:1280,height:960}, locale:'es-AR', reducedMotion:'reduce',
  args:[`--disable-extensions-except=${extension}`, `--load-extension=${extension}`]
});
await context.route('**/*', route => route.request().url().startsWith(base) ? route.continue() : route.abort());
const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker');
const page = context.pages()[0];
const cdp = await context.newCDPSession(page);
const screenshot = async name => {
  // Capture the compositor viewport directly: Playwright's clip calculations
  // can be offset after scrolling a tab with native browser zoom.
  const {data} = await cdp.send('Page.captureScreenshot', {format:'png',captureBeyondViewport:false});
  await writeFile(join(output,name),Buffer.from(data,'base64'));
};
const report = { date:new Date().toISOString(), browser:context.browser().version(), axe:axe.version, scans:[], zoom:[], spacing:[], interactions:[], errors:[] };
page.on('pageerror', error => report.errors.push(error.message));
const routes = [];
async function find(dir, prefix='/') {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    if (entry.isDirectory() && !['_astro','og'].includes(entry.name)) await find(join(dir,entry.name),prefix+entry.name+'/');
    else if (entry.name==='index.html') routes.push(prefix);
  }
}
await find(root); routes.push('/404.html');
const measure = () => page.evaluate(() => ({ width:innerWidth, height:innerHeight, dpr:devicePixelRatio, scroll:document.documentElement.scrollWidth, client:document.documentElement.clientWidth }));
const settle = async () => { await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(120); };
const zoom = async factor => {
  const actual = await worker.evaluate(async value => {
    const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
    await chrome.tabs.setZoom(tab.id,value);
    return await chrome.tabs.getZoom(tab.id);
  }, factor);
  assert.ok(Math.abs(actual-factor)<0.0001, `Expected zoom ${factor}, received ${actual}`);
  await settle();
  return actual;
};
const scan = async label => {
  await page.addScriptTag({content:axe.source});
  const result = await page.evaluate(async () => {
    const r = await axe.run(document, { runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']} });
    return { violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})), incomplete:r.incomplete.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})), passes:r.passes.length };
  });
  report.scans.push({label,...result});
  console.log(`AXE ${label}: ${result.violations.length} violations`);
};
try {
  if (!process.env.QA_ZOOM_ONLY) {
    for (const width of [390,1280]) {
      await page.setViewportSize({width,height:960});
      for (const path of routes) {
        await page.goto(base+path); await settle();
        await scan(`${path} @ ${width}`);
      }
    }
    await page.setViewportSize({width:390,height:844});
    await page.goto(base+'/'); await page.locator('[data-burger]').click();
    await scan('Mobile menu open'); await page.keyboard.press('Escape');
    await page.goto(base+'/galeria/'); await page.locator('[data-lb-group="unit-4"]').first().click();
    await page.waitForFunction(()=>document.querySelector('.lb-img').naturalWidth>0);
    await scan('Lightbox open'); await page.keyboard.press('Escape');
    await page.setViewportSize({width:1280,height:960});
    await page.goto(base+'/');
    for (const selector of ['.footer-unit','.footer-cols a','.gs-cta']) {
      await page.locator(selector).first().hover();
      await scan(`Hover ${selector}`);
    }
    for (const prefix of ['', '/en']) {
      await page.goto(base+prefix+'/servicios/');
      await page.locator('.serv-units-item').first().hover();
      await scan(`Hover ${prefix}/servicios apartment link`);
      await page.goto(base+prefix+'/unidades/unidad-4/');
      for (const selector of ['.crumb a','.other-item']) {
        await page.locator(selector).first().hover();
        await scan(`Hover ${prefix} ${selector}`);
      }
    }
  }
  await page.setViewportSize({width:1280,height:960});
  for (const factor of [2,4]) {
    for (const path of routes) {
      await page.goto(base+path); const actual=await zoom(factor);
      const bounds=await measure();
      report.zoom.push({path,factor:actual,...bounds,ok:bounds.scroll<=bounds.client+1 && Math.abs(bounds.width-1280/factor)<=1});
    }
    console.log(`Native zoom ${factor*100}%: ${routes.length} pages`);
    await page.goto(base+'/unidades/unidad-4/'); await zoom(factor);
    await screenshot(`unidad-4-zoom-${factor*100}.png`);
    await page.locator('[data-burger]').click();
    await page.locator('dialog a[href*="wa.me"]').scrollIntoViewIfNeeded();
    const menuBox=await page.locator('dialog a[href*="wa.me"]').boundingBox();
    const bounds=await measure();
    report.interactions.push({name:`Menu inquiry at ${factor*100}%`,ok:menuBox.y>=0 && menuBox.y+menuBox.height<=bounds.height+1});
    await page.keyboard.press('Escape');
    await page.goto(base+'/galeria/'); await zoom(factor);
    await page.locator('[data-lb-group="unit-4"]').first().click();
    await page.waitForFunction(()=>document.querySelector('.lb-img').naturalWidth>0);
    const meta=await page.locator('.lb-meta').boundingBox();
    const cta=await page.locator('.lb-wa').boundingBox();
    const close=await page.locator('.lb-close').boundingBox();
    const hitTargets = await page.evaluate(() => ['.lb-close','.lb-wa'].every(selector=>{
      const el=document.querySelector(selector);const r=el.getBoundingClientRect();
      return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
    }));
    report.interactions.push({name:`Lightbox controls at ${factor*100}%`,meta,cta,close,hitTargets,ok:meta.y+meta.height<=cta.y && meta.y>=close.y+close.height && hitTargets});
    await screenshot(`visor-zoom-${factor*100}.png`);
    await page.keyboard.press('Escape');
  }
  await zoom(1);
  for (const width of [390,1280]) {
    await page.setViewportSize({width,height:960});
    for (const path of routes) {
      await page.goto(base+path);
      await page.addStyleTag({content:'* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }'});
      await settle(); const bounds=await measure();
      report.spacing.push({path,...bounds,ok:bounds.scroll<=bounds.client+1});
    }
    console.log(`Text spacing ${width}px: ${routes.length} pages`);
  }
} finally {
  await writeFile(join(output,'accessibility-qa.json'),JSON.stringify(report,null,2)+'\n');
  await context.close(); server.close();
}
const failures = report.scans.filter(x=>x.violations.length).length + [...report.zoom,...report.spacing,...report.interactions].filter(x=>!x.ok).length + report.errors.length;
console.log(`${failures} failing cases`);
if(failures) process.exitCode=1;
