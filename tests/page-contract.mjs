import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');

for (const id of ['hero', 'about', 'releases', 'contact']) {
  assert.match(html, new RegExp(`id=["']${id}["']`));
}

assert.match(html, /assets\/hero-mobile\.jpg/);
assert.match(html, /assets\/hero-desktop\.jpg/);
assert.match(html, /class=["']mark["'][^>]*>\s*<img src=["']assets\/aotrom-logo\.png["']/);
assert.match(html, /class=["']author__wordmark["'] src=["']assets\/aotrom-logo\.png["']/);
assert.match(html, /class=["']footer__logo["'] src=["']assets\/aotrom-logo\.png["']/);
assert.doesNotMatch(html, /assets\/logo-(main|small)\.png/);
assert.doesNotMatch(html, />aot<br>room</);
assert.doesNotMatch(html, /<h1>aotroom<\/h1>/);
assert.doesNotMatch(html, /assets\/gallery\/img-0528\.jpg/);
assert.match(html, /<title>aotrom — музыка автора<\/title>/);
assert.match(html, /<source media=["']\(max-width: 700px\)["'] srcset=["']assets\/hero-mobile\.jpg["']/);
assert.doesNotMatch(html, /telegram-peer-photo-size|telegram-cloud-photo-size/);
assert.doesNotMatch(html, /id=["']portfolio["']/);
assert.match(html, /id=["']editorial["']/);
assert.match(html, /class=["'][^"']*\beditorial\b/);
assert.equal([...html.matchAll(/class=["']editorial__image["']/g)].length, 6);
assert.match(html, /class=["']editorial__columns["']/);
assert.ok(html.indexOf('id="releases"') < html.indexOf('id="editorial"'));
assert.match(html, /instagram\.com\/aotr0m/);
assert.match(html, /t\.me\/aotrom0/);
assert.match(html, /tel:\+79995415143/);
assert.match(app, /class="artist-row"/);
assert.match(app, /class="artist-row__type"/);
assert.doesNotMatch(app, /class="portfolio-group"/);
console.log('page contract passes');
