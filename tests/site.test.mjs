import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');

test('page presents the required portfolio story and honest placeholder disclosure', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');

  for (const fragment of [
    '<header', '<main', '<footer', 'id="work"', 'id="about"', 'id="contact"',
    'Subekshya', 'Architecture student', 'Placeholder concept',
    'Concept studies — placeholder work'
  ]) {
    assert.ok(html.includes(fragment), `missing required page fragment: ${fragment}`);
  }

  assert.match(html, /<h1[\s\S]*?<\/h1>/);
  assert.match(html, /skip-link/);
  assert.match(html, /aria-label="Primary navigation"/);
});

test('all portfolio images are local, descriptive, dimensioned, and present', async () => {
  const html = await readFile(resolve(root, 'index.html'), 'utf8');
  const images = [...html.matchAll(/<img\s+[^>]*src="([^"]+)"[^>]*>/g)];

  assert.ok(images.length >= 3, 'expected at least three project images');
  for (const [, src] of images) {
    assert.match(src, /^assets\//, `image must be local: ${src}`);
    const tag = images.find((match) => match[1] === src)[0];
    assert.match(tag, /alt="[^"]{12,}"/);
    assert.match(tag, /width="\d+"/);
    assert.match(tag, /height="\d+"/);
    await access(resolve(root, src));
  }
});

test('styles provide responsive, focus-visible, and reduced-motion states', async () => {
  const css = await readFile(resolve(root, 'styles.css'), 'utf8');

  assert.match(css, /@media\s*\([^)]*max-width/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /--blueprint:\s*#274c77/i);
});
