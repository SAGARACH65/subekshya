import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('progressive enhancement exposes named motion and interaction controllers', async () => {
  const script = await readFile(resolve(root, 'script.js'), 'utf8');

  assert.match(script, /documentElement\.classList\.add\(['"]js['"]\)/);

  for (const initializer of [
    'initIntro', 'initReveals', 'initMobileMenu', 'initPointerReticle',
    'initScrollMotion', 'initSectionNavigation', 'initArchiveFilter'
  ]) {
    assert.match(
      script,
      new RegExp(`function\\s+${initializer}|const\\s+${initializer}`),
      `missing named controller: ${initializer}`
    );
  }

  assert.match(script, /requestAnimationFrame/);
  assert.match(script, /sessionStorage/);
  assert.match(script, /event\.key\s*===\s*['"]Escape['"]/);
  assert.match(script, /event\.key\s*!==\s*['"]Tab['"]/);
});
