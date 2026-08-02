import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('progressive enhancement exposes stable initialization hooks', async () => {
  const script = await readFile(resolve(root, 'script.js'), 'utf8');

  assert.match(script, /documentElement\.classList\.add\(['"]js['"]\)/);
  assert.match(script, /IntersectionObserver/);
  assert.match(script, /pointermove/);
  assert.match(script, /prefers-reduced-motion/);
  assert.match(script, /data-filter/);
  assert.match(script, /data-project/);
});
