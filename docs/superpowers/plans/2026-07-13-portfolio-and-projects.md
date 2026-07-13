# Portfolio and Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the site into a portfolio of artists and projects with a reference-style list on the home page, individual work pages, and the supplied music/video links.

**Architecture:** Keep all portfolio metadata in one ES module consumed by the home page and detail pages. The home page renders a typographic row list and a grouped portfolio index. Detail pages identify their entry with `data-portfolio-key`; one renderer supplies their media card and external work list.

**Tech Stack:** Static HTML, CSS, browser-native ES modules, Node assertion tests, Vercel static deployment.

---

## Approved revision — individual work pages only

This revision supersedes the original shared `#portfolio` section: the home page contains only reference-style artist/project rows, and every row opens a dedicated page with only that artist or project's links. The row list includes 11 entries: каузация, ALYA, Виктория Соломахина, Наблюдатели, aotrom, LAREN, Владимир Широков, ALTRO CORO, Остальные проекты, Голос and Браво Бис. Short URLs must use researched track/performance names, never `релиз 01` or `видео 01`.

The shared data module remains the single source of truth. `app.js` renders only `artist-row` entries. `work-page.js` renders one group's named links within each detail page; image-bearing entries use their photos/artwork whole and inside a bounded media card, while entries without supplied imagery are typographic-only pages.

The final page set is `kauzatsiya/`, `alya/`, `viktoriya-solomakhina/`, `nablyudateli/`, `aotrom/`, `laren/`, `vladimir-shirokov/`, `altro-coro/`, `other-projects/`, `golos/`, and `bravo-bis/`. The original Task 2 portfolio-index output is removed. The original Task 3 six-page scope expands to these 11 pages.

---

### Task 1: Add the portfolio inventory and its contract

**Files:**
- Create: `portfolio-data.js`
- Modify: `tests/character-pages.mjs`

- [ ] **Step 1: Write the failing test**

Add these assertions to `tests/character-pages.mjs`:

```js
const portfolioData = await readFile(new URL('../portfolio-data.js', import.meta.url), 'utf8').catch(() => '');

for (const label of ['Виктория Соломахина', 'каузация', 'ALYA', 'aotrom', 'LAREN', 'Владимир Широков', 'Наблюдатели', 'ALTRO CORO', 'Голос', 'Браво Бис']) {
  assert.match(portfolioData, new RegExp(label));
}
assert.match(portfolioData, /https:\/\/band\.link\/__polushko/);
assert.match(portfolioData, /https:\/\/www\.1tv\.ru\/-\/eqgkx/);
assert.match(portfolioData, /https:\/\/vkvideo\.ru\/video-232371204_456239286/);
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: `character page contract` fails because `portfolio-data.js` is absent.

- [ ] **Step 3: Create the shared data module**

Create `portfolio-data.js` with this public shape:

```js
export const entries = [
  { key: 'kauzatsiya', number: '01', title: 'каузация', type: 'артист', href: 'kauzatsiya/', image: 'assets/characters/kauzatsiya.jpg', monochrome: true },
  { key: 'alya', number: '02', title: 'ALYA', type: 'артист', href: 'alya/', image: 'assets/characters/alya.jpg', monochrome: true },
  { key: 'viktoriya-solomakhina', number: '03', title: 'Виктория Соломахина', type: 'артист', href: 'viktoriya-solomakhina/', image: 'assets/characters/viktoriya-solomakhina.jpg', monochrome: true },
  { key: 'nablyudateli', number: '04', title: 'Наблюдатели', type: 'артист', href: 'nablyudateli/', image: 'assets/characters/nablyudateli.jpg', monochrome: true },
  { key: 'golos', number: '05', title: 'Голос', type: 'проект', href: 'golos/', image: 'assets/projects/golos.png', monochrome: false },
  { key: 'bravo-bis', number: '06', title: 'Браво Бис', type: 'проект', href: 'bravo-bis/', image: 'assets/projects/bravo-bis.png', monochrome: false },
];
```

Add `portfolioGroups` with the following exact URL inventory. Use neutral titles `релиз 01` through `релиз 08` for opaque music shortlinks, and `видео 01` through `видео 13` for opaque video shortlinks:

```js
export const portfolioGroups = [
  { key: 'viktoriya-solomakhina', title: 'Виктория Соломахина', kind: 'музыка', links: [
    ['Полюшко', 'https://band.link/__polushko'], ['Русалочка', 'https://bnd.lc/rusalochkaa'], ['Унеси', 'https://vikso.band.link/_unesi'], ['Проснись со мной', 'https://band.link/prosnissomnoy'], ['Прощай', 'https://band.link/proshay'], ['Мой городок', 'https://band.link/moygorodok'],
  ] },
  { key: 'kauzatsiya', title: 'каузация', kind: 'музыка', links: [['альбом', 'https://aliy-mayak.band.link/otdt'], ['Научиться', 'https://band.link/nauchitsya'], ['Рано-рано', 'https://band.link/ranorano']] },
  { key: 'alya', title: 'ALYA', kind: 'музыка', links: [['релиз 01', 'https://band.link/8Kxmc'], ['релиз 02', 'https://band.link/Zqv4j'], ['релиз 03', 'https://band.link/Xo9Ts'], ['релиз 04', 'https://band.link/2cXdt'], ['релиз 05', 'https://band.link/nnkQj'], ['релиз 06', 'https://band.link/MpXBr'], ['Ближе', 'https://aliy-mayak.bnd.lc/blizhee'], ['релиз 08', 'https://band.link/rztpq']] },
  { key: 'aotrom', title: 'aotrom', kind: 'музыка', links: [['Взрослый', 'http://lnk.embers.digital/remixed'], ['Exposure', 'https://band.link/exposure?fbclid=PAZXh0bgNhZW0CMTEAAaY0xzLidKeyibymPVt1IPZ5uf4wNVWkUfV_o-khjTcl-UrdQbtd5WAOb6I_aem_WgGBvwBXBr_GXN6AUII5ZA'], ['Loss', 'https://band.link/lossaotrom'], ['Sympathy', 'https://band.link/sympathyaotrom']] },
  { key: 'laren', title: 'LAREN', kind: 'музыка', links: [['релиз 01', 'https://zvonko.link/204890A'], ['релиз 02', 'https://zvonko.link/20F9445'], ['релиз 03', 'https://zvonko.link/214A93B'], ['релиз 04', 'https://zvonko.link/2450304']] },
  { key: 'vladimir-shirokov', title: 'Владимир Широков', kind: 'музыка', links: [['Ты танцуешь одна / Дыхание', 'https://band.link/DYHANIE_ALBUM'], ['релиз 02', 'https://music.yandex.ru/album/36334657/track/138468675?utm_source=web&utm_medium=copy_link']] },
  { key: 'nablyudateli', title: 'Наблюдатели', kind: 'музыка', links: [['релиз 01', 'https://band.link/mjGPe'], ['релиз 02', 'https://band.link/r0Ofj']] },
  { key: 'altro-coro', title: 'ALTRO CORO', kind: 'музыка', links: [['Мой городок', 'https://band.link/moygorodok'], ['релиз 02', 'https://band.link/_dryg']] },
  { key: 'other-projects', title: 'Остальные проекты', kind: 'музыка', links: [['релиз 01', 'https://band.link/XY8Vf'], ['релиз 02', 'https://band.link/keirafire'], ['релиз 03', 'https://onerpm.link/902558270024?fbclid=PAAaaL8po36c9IoUv8oKC7uqG4Z_ISgOUNExysskmrLGhZ9Nb-qMdJip3TiKo_aem_AZH4Vq1xjNXrq4dsc3luA3Uz9z7mroiXfwwEeHjqD5q-DMxAB8hdz7voULFoW5mlJv0'], ['релиз 04', 'https://band.link/U6sIy'], ['релиз 05', 'http://allstarmusic.link/vita_lotereya']] },
  { key: 'golos', title: 'Голос', kind: 'видео', links: [['видео 01', 'https://www.1tv.ru/-/eqgkx'], ['Выше', 'https://www.1tv.ru/shows/golos-11/vystupleniya/viktoriya-solomahina-vyshe-golos-11-chetvertfinal-fragment-vypuska-ot-19-05-2023'], ['видео 03', 'https://www.1tv.ru/-/sesqmi'], ['видео 04', 'https://www.1tv.ru/-/lrzwdr'], ['видео 05', 'https://www.1tv.ru/-/dxceoo'], ['видео 06', 'https://www.1tv.ru/-/tercbf'], ['видео 07', 'https://www.1tv.ru/-/jvwpcu'], ['видео 08', 'https://1tv.ru/-/mbqbkf'], ['видео 09', 'https://1tv.ru/-/cvbljs'], ['Метелица', 'https://www.1tv.ru/shows/golos-13/vystupleniya/valentina-yanshina-metelica-nokauty-golos-vypusk-ot-04-04-2025'], ['видео 11', 'https://1tv.ru/-/cbxmde'], ['видео 12', 'https://1tv.ru/-/gpupyv'], ['видео 13', 'https://1tv.ru/-/vupmof']] },
  { key: 'bravo-bis', title: 'Браво Бис', kind: 'видео', links: [['видео 01', 'https://vkvideo.ru/video-232371204_456239286?pl=-232371204_1&t=19s'], ['видео 02', 'https://vkvideo.ru/video-232371204_456239227?pl=-232371204_1&t=29s']] },
];
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`

Expected: `page contract passes` and `character page contract passes`.

- [ ] **Step 5: Commit**

```bash
git add portfolio-data.js tests/character-pages.mjs
git commit -m "feat: add portfolio inventory"
```

### Task 2: Restore the reference-style artist and project list

**Files:**
- Modify: `index.html`
- Modify: `app.js`
- Modify: `styles.css`
- Test: `tests/page-contract.mjs`

- [ ] **Step 1: Write the failing test**

Assert that `index.html` contains `<section id="portfolio"` and `app.js` renders `class="artist-row"`, `class="artist-row__type"`, and `class="portfolio-group"`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: assertion failure for `artist-row`.

- [ ] **Step 3: Implement the home rendering**

Replace the `people-grid` renderer with an import from `./portfolio-data.js` that renders each `entries` item as:

```html
<article class="artist-row">
  <span class="artist-row__number">01</span>
  <h3 class="artist-row__title">каузация</h3>
  <span class="artist-row__type">артист</span>
  <a class="artist-row__action" href="kauzatsiya/">войти ↗</a>
</article>
```

Add a `#portfolio` section after the artist list. Render one `portfolio-group` per `portfolioGroups`; each link uses `target="_blank" rel="noreferrer"` and text `слушать ↗` for music or `смотреть ↗` for video.

CSS requirements: rows use the four-column desktop reference layout with horizontal rules; mobile uses number, title and action in three columns. Do not include project images on the home page.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`

Expected: both contract scripts pass.

- [ ] **Step 5: Commit**

```bash
git add index.html app.js styles.css tests/page-contract.mjs
git commit -m "feat: add artist project list and portfolio index"
```

### Task 3: Build non-cropped detail-page media and works lists

**Files:**
- Create: `work-page.js`
- Create: `golos/index.html`
- Create: `bravo-bis/index.html`
- Modify: `kauzatsiya/index.html`
- Modify: `alya/index.html`
- Modify: `viktoriya-solomakhina/index.html`
- Modify: `nablyudateli/index.html`
- Modify: `styles.css`
- Copy: `assets/projects/golos.png` from `/Users/marianna/Downloads/Telegram/image_2026-07-13_02-39-44.png`
- Copy: `assets/projects/bravo-bis.png` from `/Users/marianna/Downloads/Telegram/image_2026-07-13_02-40-19.png`
- Test: `tests/character-pages.mjs`

- [ ] **Step 1: Write the failing test**

Assert that the two project pages exist; all six detail pages have `data-portfolio-key`; `work-page.js` contains `work-page__media`; and CSS contains `.work-page__media img {` with `object-fit: contain`.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test`

Expected: missing project pages and data attributes.

- [ ] **Step 3: Implement the shared renderer and pages**

Each detail page sets `data-portfolio-key` on `<body>`, includes an empty `#work-page-content`, and loads `../work-page.js` as a module. `work-page.js` finds the corresponding entry and group, then renders this structure:

```html
<section class="work-page section">
  <p class="section__kicker">03 / артист</p>
  <div class="work-page__intro">
    <h1>Виктория Соломахина</h1>
    <figure class="work-page__media work-page__media--mono"><img src="../assets/characters/viktoriya-solomakhina.jpg" alt="Виктория Соломахина"></figure>
  </div>
  <ol class="work-page__links"><li><a href="https://band.link/__polushko" target="_blank" rel="noreferrer">Полюшко <span>слушать ↗</span></a></li></ol>
</section>
```

CSS requirements: no detail-page image is a viewport background; `.work-page__media` has a bounded width, `max-height: min(72svh, 780px)`, neutral backing surface, and `overflow: hidden`; its `img` has `width: 100%`, `height: 100%`, `object-fit: contain`. Apply grayscale only when the entry's `monochrome` field is true; project images retain their colour.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`

Expected: both contract scripts pass.

- [ ] **Step 5: Commit**

```bash
git add work-page.js golos/index.html bravo-bis/index.html kauzatsiya/index.html alya/index.html viktoriya-solomakhina/index.html nablyudateli/index.html assets/projects styles.css tests/character-pages.mjs
git commit -m "feat: add work pages for artists and projects"
```

### Task 4: Visual QA and production release

**Files:**
- Verify: `index.html`, all six detail pages, `styles.css`

- [ ] **Step 1: Verify the local contracts**

Run: `npm test && git diff --check`

Expected: both test scripts pass and no whitespace errors are reported.

- [ ] **Step 2: Perform visual QA**

At 390×844 verify the artist/project rows, `#portfolio`, Victoria page and Golos page. At 1440×960 verify the same set. Confirm photos are not cropped, project artwork is coloured, all text remains inside its row, and each external work link has `_blank` and `noreferrer`.

- [ ] **Step 3: Commit and push the completed change**

```bash
git add index.html app.js styles.css portfolio-data.js work-page.js kauzatsiya alya viktoriya-solomakhina nablyudateli golos bravo-bis assets/projects tests
git commit -m "feat: publish portfolio and projects"
git push origin main
```

- [ ] **Step 4: Deploy and verify production**

Run with the active Vercel credential: `vercel deploy . --prod --yes --scope andykislov394-1347s-projects`.

Confirm the deployment is Ready with `vercel inspect <deployment-url>`, then fetch `https://aotrom.art/?v=portfolio` and verify that its HTML contains `artist-row`, `portfolio`, and the latest unified logo path.
