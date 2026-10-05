import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/whatsapp-analytics.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});

function setup(pathname = '/', lang = 'es') {
  const events = [];
  const listeners = new Map();
  class Element {
    constructor(link) { this.link = link; }
    closest(selector) { assert.equal(selector, 'a[href]'); return this.link; }
  }
  const window = { location: { pathname, origin: 'https://refugiodelcorazon.com.ar' }, gtag: (...args) => events.push(args) };
  const document = { documentElement: { lang }, addEventListener(type, handler) {
    assert.ok(!listeners.has(type), 'only one listener per event type');
    listeners.set(type, handler);
  } };
  runInNewContext(outputText, { exports: {}, Element, URL, window, document });
  return {
    events, window,
    click({ type = 'click', button = 0, href = 'https://wa.me/message/test?text=private', dataset = {}, hasLink = true } = {}) {
      const target = new Element(hasLink ? { href, dataset } : null);
      listeners.get(type)({ type, button, target });
    },
  };
}

test('one WhatsApp event per normal activation, including a child icon, without message data', () => {
  const app = setup('/en/unidades/unidad-3/', 'en');
  app.click({ dataset: { ctaLocation: 'unit_header' } });
  app.click({ type: 'auxclick', button: 0 });
  assert.equal(app.events.length, 1);
  assert.deepEqual(JSON.parse(JSON.stringify(app.events[0])), ['event', 'whatsapp_click', {
    page_path: '/en/unidades/unidad-3/', page_language: 'en', unit: 'unidad-3',
    cta_location: 'unit_header', transport_type: 'beacon',
  }]);
  assert.ok(!JSON.stringify(app.events).includes('private'));
});

test('middle click counted once; right click and other destinations ignored', () => {
  const app = setup();
  app.click({ type: 'auxclick', button: 1 });
  app.click({ type: 'auxclick', button: 2 });
  app.click({ button: 1 });
  app.click({ href: 'https://wa.me.example.com/' });
  app.click({ href: 'https://refugiodelcorazon.com.ar/galeria/' });
  app.click({ hasLink: false });
  assert.equal(app.events.length, 1);
});

test('lightbox unit overrides page context and can return to general context', () => {
  const app = setup('/galeria/');
  const dataset = { ctaLocation: 'lightbox', unit: 'unidad-2' };
  app.click({ dataset });
  dataset.unit = 'unidad-4';
  app.click({ dataset });
  dataset.unit = '';
  app.click({ dataset });
  assert.deepEqual(app.events.map(e => e[2].unit), ['unidad-2', 'unidad-4', 'general']);
});

test('navigation remains usable when analytics is unavailable', () => {
  const app = setup();
  delete app.window.gtag;
  assert.doesNotThrow(() => app.click());
  assert.equal(app.events.length, 0);
});
