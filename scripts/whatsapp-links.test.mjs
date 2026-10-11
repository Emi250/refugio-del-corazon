import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

function helper(number = '5493548406347') {
  const source = readFileSync(new URL('../src/utils/whatsapp.ts', import.meta.url), 'utf8')
    .replaceAll('import.meta.env.PUBLIC_WHATSAPP_NUMBER', JSON.stringify(number));
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  runInNewContext(outputText, { exports });
  return exports;
}

test('inquiries preserve apartment, accents and language in a single encoded query', () => {
  const api = helper();
  for (const [lang, unit, intro] of [['es', 'Departamento #4', 'Hola'], ['en', 'Apartment #3', 'Hi']]) {
    const url = new URL(api.waLinkForUnit(unit, lang));
    assert.equal(url.hostname, 'wa.me');
    assert.equal(url.pathname, '/5493548406347');
    assert.equal(url.hash, '');
    assert.equal(url.searchParams.size, 1);
    const message = url.searchParams.get('text');
    assert.ok(message.startsWith(intro));
    assert.ok(message.includes(unit));
    assert.ok(message.includes('El Refugio'));
    assert.equal(message.split('\n').length, 3);
    assert.ok(message.includes(lang === 'es' ? 'Fechas de entrada y salida:' : 'Check-in and check-out dates:'));
    assert.ok(message.includes(lang === 'es' ? 'Cantidad de personas:' : 'Number of guests:'));
  }
});

test('general inquiry is localized and custom messages round-trip without truncation', () => {
  const api = helper();
  assert.match(new URL(api.waLink(undefined, 'en')).searchParams.get('text'), /^Hi,/);
  const message = 'Consulta #1 & fechas: ¿sábado o domingo?\nDos personas.';
  assert.equal(new URL(api.waLink(message)).searchParams.get('text'), message);
});

test('missing or invalid destination fails instead of publishing a broken contact link', () => {
  for (const number of ['', '123', '000000000', 'not-configured']) {
    assert.throws(() => helper(number).waLink());
  }
});
