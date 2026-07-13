import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const home = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const character = await readFile(new URL('../kauzatsiya/index.html', import.meta.url), 'utf8');
const alya = await readFile(new URL('../alya/index.html', import.meta.url), 'utf8');
const viktoriya = await readFile(new URL('../viktoriya-solomakhina/index.html', import.meta.url), 'utf8');
const nablyudateli = await readFile(new URL('../nablyudateli/index.html', import.meta.url), 'utf8').catch(() => '');
const golos = await readFile(new URL('../golos/index.html', import.meta.url), 'utf8').catch(() => '');
const bravoBis = await readFile(new URL('../bravo-bis/index.html', import.meta.url), 'utf8').catch(() => '');
const aotromPage = await readFile(new URL('../aotrom/index.html', import.meta.url), 'utf8').catch(() => '');
const laren = await readFile(new URL('../laren/index.html', import.meta.url), 'utf8').catch(() => '');
const vladimir = await readFile(new URL('../vladimir-shirokov/index.html', import.meta.url), 'utf8').catch(() => '');
const altroCoro = await readFile(new URL('../altro-coro/index.html', import.meta.url), 'utf8').catch(() => '');
const otherProjects = await readFile(new URL('../other-projects/index.html', import.meta.url), 'utf8').catch(() => '');
const styles = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
const portfolioData = await readFile(new URL('../portfolio-data.js', import.meta.url), 'utf8').catch(() => '');

assert.match(home, /id=["']release-list["']/);
assert.match(home, /<h2 id=["']releases-title["']>артисты<br>и проекты<\/h2>/);
assert.match(app, /import \{ entries \} from '\.\/portfolio-data\.js';/);
assert.match(app, /class="artist-row"/);
assert.doesNotMatch(app, /class="portfolio-group"/);
assert.match(app, /aria-label="войти: \$\{title\}"/);
for (const [page, key] of [[character, 'kauzatsiya'], [alya, 'alya'], [viktoriya, 'viktoriya-solomakhina'], [nablyudateli, 'nablyudateli'], [aotromPage, 'aotrom'], [laren, 'laren'], [vladimir, 'vladimir-shirokov'], [altroCoro, 'altro-coro'], [otherProjects, 'other-projects'], [golos, 'golos'], [bravoBis, 'bravo-bis']]) {
  assert.match(page, new RegExp(`data-portfolio-key="${key}"`));
  assert.match(page, /\.\.\/work-page\.js/);
  assert.match(page, /\.\.\/assets\/aotrom-logo\.png/);
}
assert.doesNotMatch(`${home}${character}${alya}${viktoriya}${nablyudateli}${aotromPage}${laren}${vladimir}${altroCoro}${otherProjects}${golos}${bravoBis}`, /AOTROOM|aotroom/);
assert.doesNotMatch(`${home}${character}${alya}${viktoriya}${nablyudateli}${aotromPage}${laren}${vladimir}${altroCoro}${otherProjects}${golos}${bravoBis}`, /персонаж/);
const workPage = await readFile(new URL('../work-page.js', import.meta.url), 'utf8').catch(() => '');
assert.match(workPage, /work-page__polaroid/);
assert.match(styles, /\.work-page__polaroid img \{[\s\S]*?object-fit: contain;/);
for (const label of ['Виктория Соломахина', 'каузация', 'ALYA', 'aotrom', 'LAREN', 'Владимир Широков', 'Наблюдатели', 'ALTRO CORO', 'Голос', 'Браво Бис', 'Музыка внутри', 'Ты не верь слезам', 'Проснись со мной', 'Мой городок']) {
  assert.match(portfolioData, new RegExp(label));
}
assert.match(portfolioData, /https:\/\/band\.link\/__polushko/);
assert.match(portfolioData, /https:\/\/www\.1tv\.ru\/-\/eqgkx/);
assert.match(portfolioData, /https:\/\/vkvideo\.ru\/video-232371204_456239286/);
assert.doesNotMatch(portfolioData, /релиз \d+|видео \d+/);
assert.match(portfolioData, /category: 'tv'/);
assert.match(styles, /filter:\s*grayscale\(1\)/);
assert.match(styles, /\.work-page__polaroid/);
assert.match(styles, /\.polaroid img \{[\s\S]*?aspect-ratio: 3 \/ 4;[\s\S]*?object-fit: contain;/);
assert.doesNotMatch(styles, /\.person-card:nth-child\(3\) \.polaroid \{ grid-column:/);
assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.polaroid figcaption strong \{ font-size: clamp\(16px, 4\.7vw, 21px\); \}/);
assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.hero__image \{ object-position: center center; filter: none; \}/);
assert.match(styles, /@media \(max-width: 700px\)[\s\S]*?\.contact__content \{ gap: 24px; \}/);
console.log('character page contract passes');
