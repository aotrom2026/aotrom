import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const character = await readFile(new URL('../kauzatsiya/index.html', import.meta.url), 'utf8');
const alya = await readFile(new URL('../alya/index.html', import.meta.url), 'utf8');
const viktoriya = await readFile(new URL('../viktoriya-solomakhina/index.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');

assert.match(home, /id=["']release-list["']/);
assert.match(app, /href:\s*'kauzatsiya\/'/);
assert.match(app, /title:\s*'каузация'/);
assert.match(app, /href:\s*'alya\/'/);
assert.match(app, /title:\s*'ALYA'/);
assert.match(app, /href:\s*'viktoriya-solomakhina\/'/);
assert.match(app, /title:\s*'Виктория Соломахина'/);
assert.match(character, /каузация/);
assert.match(character, /\.\.\/assets\/characters\/kauzatsiya\.jpg/);
assert.match(alya, /ALYA/);
assert.match(alya, /\.\.\/assets\/characters\/alya\.jpg/);
assert.match(viktoriya, /Виктория Соломахина/);
assert.match(viktoriya, /\.\.\/assets\/characters\/viktoriya-solomakhina\.jpg/);
assert.doesNotMatch(`${home}${character}${alya}${viktoriya}`, /AOTROOM|aotroom/);
assert.match(styles, /filter:\s*grayscale\(1\)/);
console.log('character page contract passes');
