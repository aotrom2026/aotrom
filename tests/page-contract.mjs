import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

for (const id of ['hero', 'about', 'releases', 'contact']) {
  assert.match(html, new RegExp(`id=["']${id}["']`));
}

assert.match(html, /assets\/hero-mobile\.jpg/);
assert.match(html, /assets\/hero-desktop\.jpg/);
assert.match(html, /assets\/logo-main\.png/);
assert.match(html, /assets\/logo-small\.png/);
assert.match(html, /class=["']mark["'][^>]*>\s*<img src=["']assets\/logo-small\.png["']/);
assert.doesNotMatch(html, />aot<br>room</);
assert.match(html, /<source media=["']\(max-width: 700px\)["'] srcset=["']assets\/hero-mobile\.jpg["']/);
assert.doesNotMatch(html, /telegram-peer-photo-size|telegram-cloud-photo-size/);
console.log('page contract passes');
