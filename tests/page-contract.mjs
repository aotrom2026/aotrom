import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

for (const id of ['hero', 'about', 'releases', 'contact']) {
  assert.match(html, new RegExp(`id=["']${id}["']`));
}

assert.match(html, /assets\/hero-mobile\.jpg/);
assert.match(html, /assets\/hero-desktop\.jpg/);
assert.match(html, /class=["']mark["'][^>]*>\s*<img src=["']assets\/aotrom-logo\.png["']/);
assert.match(html, /class=["']about__logo["'] src=["']assets\/aotrom-logo\.png["']/);
assert.match(html, /class=["']footer__logo["'] src=["']assets\/aotrom-logo\.png["']/);
assert.doesNotMatch(html, /assets\/logo-(main|small)\.png/);
assert.doesNotMatch(html, />aot<br>room</);
assert.doesNotMatch(html, /<h1>aotroom<\/h1>/);
assert.doesNotMatch(html, /assets\/gallery\/img-0528\.jpg/);
assert.match(html, /<title>aotrom — музыка автора<\/title>/);
assert.match(html, /<source media=["']\(max-width: 700px\)["'] srcset=["']assets\/hero-mobile\.jpg["']/);
assert.doesNotMatch(html, /telegram-peer-photo-size|telegram-cloud-photo-size/);
console.log('page contract passes');
