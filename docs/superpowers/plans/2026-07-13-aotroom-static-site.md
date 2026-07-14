# aotrom Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and visually verify a responsive, single-page aotrom artist site that follows the approved o3ero-inspired composition while using only user-provided imagery.

**Architecture:** A dependency-free static page in `index.html` uses CSS media queries to switch hero images and a short JavaScript renderer for release rows. Assets live locally under `assets/`, including a small curated gallery from the authorised Yandex Disk folder. Browser checks run against a local Python HTTP server through Playwright.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Python `http.server`, Playwright browser automation.

---

### Task 1: Create the source layout and local asset boundary

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `assets/hero-mobile.jpg`
- Create: `assets/hero-desktop.jpg`
- Create: `assets/gallery/dsc02514.jpg`
- Create: `assets/gallery/img-0528.jpg`
- Create: `assets/gallery/img-2194.jpg`
- Create: `.gitignore`

- [ ] **Step 1: Copy the two explicitly supplied hero files into the site assets**

Run:

```bash
mkdir -p assets/gallery
cp '/Users/marianna/Downloads/Telegram/IMG_2346.jpg' assets/hero-mobile.jpg
cp '/Users/marianna/Downloads/Telegram/ca56dfc7-d4bc-40f4-8dd0-feb5c9480dfd.JPG' assets/hero-desktop.jpg
```

Expected: both files are located below `assets/`; no page refers to the old Telegram photo.

- [ ] **Step 2: Download the three supporting images from the authorised public Yandex Disk folder**

Use `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=https%3A%2F%2Fdisk.yandex.ru%2Fd%2FMUI4m4LvBJ87Kg&limit=100` to obtain each selected item’s `file` URL, then download those URLs with `curl -L --fail` into the three gallery paths. Select `DSC02514.jpg`, `IMG_0528 2.JPG`, and `IMG_2194.JPG` so the page has varied supporting imagery.

Expected: the three files decode as images with `sips -g pixelWidth -g pixelHeight assets/gallery/*`.

- [ ] **Step 3: Add a narrow `.gitignore`**

```gitignore
.DS_Store
.superpowers/
```

- [ ] **Step 4: Commit the asset boundary when Git is available**

```bash
git add .gitignore assets
git commit -m "chore: add aotrom site imagery"
```

Expected: commit succeeds in a Git worktree; if the folder is not a repository, preserve the files without initializing Git.

### Task 2: Define a testable page contract before visual styling

**Files:**
- Create: `tests/page-contract.mjs`
- Create: `package.json`
- Modify: `index.html`

- [ ] **Step 1: Write the failing static contract test**

```js
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
for (const id of ['hero', 'about', 'releases', 'contact']) {
  assert.match(html, new RegExp(`id=["']${id}["']`));
}
assert.match(html, /assets\/hero-mobile\.jpg/);
assert.match(html, /assets\/hero-desktop\.jpg/);
assert.doesNotMatch(html, /telegram-peer-photo-size/);
console.log('page contract passes');
```

- [ ] **Step 2: Run the test and confirm it fails because the page does not exist yet**

Run: `node tests/page-contract.mjs`

Expected: failure beginning with `ENOENT` for `index.html`.

- [ ] **Step 3: Create the minimal semantic skeleton**

```html
<!doctype html>
<html lang="ru">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="styles.css"><title>aotrom</title></head>
  <body>
    <main>
      <section id="hero" class="hero" aria-label="aotrom"><picture><source media="(max-width: 700px)" srcset="assets/hero-mobile.jpg"><img src="assets/hero-desktop.jpg" alt="Портрет автора aotrom"></picture></section>
      <section id="about"></section><section id="releases"></section><section id="contact"></section>
    </main><script type="module" src="app.js"></script>
  </body>
</html>
```

- [ ] **Step 4: Add the test command and run it again**

```json
{"type":"module","scripts":{"test":"node tests/page-contract.mjs"}}
```

Run: `npm test`

Expected: `page contract passes`.

- [ ] **Step 5: Commit the page contract**

```bash
git add package.json tests/page-contract.mjs index.html
git commit -m "test: define aotrom page contract"
```

### Task 3: Implement the approved page and release renderer

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `app.js`

- [ ] **Step 1: Add the page sections and stable navigation anchors**

Use this order inside `main`: the photo hero with white `aot` / `room` mark and links to `#about`, `#releases`, `#contact`; an about sentence; `#releases` with an empty `<div id="release-list"></div>`; a three-image gallery; and contact/footer placeholders. Keep user-facing content deliberately replaceable: `скоро`, `новая музыка`, `связь`.

- [ ] **Step 2: Implement the release data renderer**

```js
const releases = [
  { year: '2026', title: 'новая музыка', status: 'скоро' },
  { year: '2026', title: 'неизданное', status: 'скоро' },
  { year: '2025', title: 'архив', status: 'скоро' },
];

document.querySelector('#release-list').innerHTML = releases.map(({ year, title, status }, index) => `
  <article class="release">
    <span>${String(index + 1).padStart(2, '0')}</span><span>${title}</span><span>${year}</span><span>${status}</span>
  </article>`).join('');
```

- [ ] **Step 3: Implement the visual system in `styles.css`**

Use a full viewport hero. Position the fixed-looking hero text at the four corners, apply `object-fit: cover`, and use `object-position: 72% center` for the desktop portrait. The mobile source must be selected below `701px` with `object-position:center center`, a taller hero (`min-height:100svh`), and a darker gradient for readability. Follow with a `#f4f4f3` body, black type, 1px dividers, no rounded components, and a grid that collapses to one column on mobile. Include visible keyboard focus and `@media (prefers-reduced-motion: reduce)` to disable smooth scroll and transitions.

- [ ] **Step 4: Run the static test**

Run: `npm test`

Expected: `page contract passes`.

- [ ] **Step 5: Commit the first complete page**

```bash
git add index.html styles.css app.js
git commit -m "feat: build aotrom artist landing page"
```

### Task 4: Run local visual QA in the browser

**Files:**
- Modify: `index.html` or `styles.css` only if QA exposes a visual issue

- [ ] **Step 1: Start the static server**

Run: `python3 -m http.server 4173 --directory .`

Expected: serving `http://127.0.0.1:4173`.

- [ ] **Step 2: Test mobile rendering at 390 px width**

In Playwright, set a 390 × 844 viewport, open the local URL, capture a screenshot, and assert the hero image source ends in `hero-mobile.jpg`. Verify logo and all four navigation items remain readable, then scroll to releases and verify every release row is visible.

- [ ] **Step 3: Test desktop rendering at 1440 px width**

In Playwright, set a 1440 × 960 viewport, reload the local URL, capture a screenshot, and assert the hero source ends in `hero-desktop.jpg`. Verify that the right-facing portrait is not cropped at the face and that the menu remains on the right side.

- [ ] **Step 4: Check interaction and console**

Click the `работы` link, verify the URL ends with `#releases`, and inspect console logs for errors. If an issue is found, make the smallest CSS/HTML correction and repeat the affected screenshot check.

- [ ] **Step 5: Commit QA correction if one was required**

```bash
git add index.html styles.css app.js
git commit -m "fix: refine aotrom responsive layout"
```
