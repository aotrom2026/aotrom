# Author Profile and TV Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete author profile, contacts, editorial-playlist gallery, high-quality polaroid artist media, and a distinct TV-projects group.

**Architecture:** Static author text and editorial assets live in `index.html`/`assets/editorial`; the only interactive component is a native `details` disclosure. Existing `work-page.js` continues rendering data-driven detail pages, with CSS making every supplied artist image a full-frame polaroid. `app.js` renders two home groups from `entries` based on each item’s `category`.

**Tech Stack:** Static HTML, CSS, browser-native ES modules, Node assertion tests, Vercel.

---

### Task 1: Import assets and define test contracts

**Files:**
- Create: `assets/author/andrey-profile.jpg`
- Create: `assets/editorial/*.jpg`
- Modify: `tests/page-contract.mjs`
- Modify: `tests/character-pages.mjs`

- [ ] **Step 1: Write failing assertions**

Require `#editorial`, `details.editorial`, six `editorial__image` elements, Instagram/Telegram/tel links, `.work-page__polaroid`, and `category: 'tv'` in `portfolio-data.js`.

- [ ] **Step 2: Run the test**

Run `npm test`; expect a missing editorial/assertion failure.

- [ ] **Step 3: Copy the supplied images**

Copy `IMG_2189.JPG` to `assets/author/andrey-profile.jpg`. Copy the six Telegram playlist screenshots to `assets/editorial/playlist-01.jpg` through `playlist-06.jpg` in the order supplied.

- [ ] **Step 4: Implement only enough metadata for the test**

Add `category: 'tv'` to Golos and Bravo Bis entries; all other entries receive `category: 'music'`.

- [ ] **Step 5: Re-run tests and commit**

Run `npm test`; commit the imported assets, data metadata and tests.

### Task 2: Build author profile, contacts and editorial disclosure

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Test: `tests/page-contract.mjs`

- [ ] **Step 1: Add the author profile markup**

Replace the placeholder about copy with title `Андрей Кислов — aotrom`, a lead describing six years of full-cycle music production, sections for television, full-cycle production, remixes/aotrom, other formats and services. Add a contained author polaroid using `assets/author/andrey-profile.jpg`.

- [ ] **Step 2: Add editorial gallery markup**

Use `<details class="editorial" id="editorial"><summary>мои треки в редакторских полосах <span>+</span></summary>...</details>`. Add six color images, playlist achievement text and the Afisha Daily link `https://daily.afisha.ru/music/26940-31-glavnyy-novichok-2024-goda-vybor-kuoka-afishi-daily-i-vk-muzyki/` with `target="_blank" rel="noreferrer"`.

- [ ] **Step 3: Replace contact placeholder**

Use `https://instagram.com/aotr0m`, `https://t.me/aotrom0`, and `tel:+79995415143` with visible label `+7 999 541-51-43`.

- [ ] **Step 4: Style and verify**

Author photos use grayscale; editorial images use `filter: none` and `object-fit: contain`. Run `npm test` and commit.

### Task 3: Group TV projects and upgrade detail photos to polaroids

**Files:**
- Modify: `portfolio-data.js`
- Modify: `app.js`
- Modify: `work-page.js`
- Modify: `styles.css`
- Test: `tests/character-pages.mjs`

- [ ] **Step 1: Render home groups**

Render `entries.filter(({ category }) => category === 'music')` under the existing list, then an `h3` group label `ТВ-проекты` and `entries.filter(({ category }) => category === 'tv')` below it. Both use the same accessible `artist-row` markup and distinct `aria-label` values.

- [ ] **Step 2: Render media as polaroids**

Change the media template to `<figure class="work-page__polaroid ..."><img ...></figure>`. CSS provides white frame, lower caption space and `object-fit: contain`; monochrome applies only to artist photos, never to Golos/Bravo artwork.

- [ ] **Step 3: Re-run tests and commit**

Run `npm test && git diff --check`; commit the grouping and media update.

### Task 4: Visual QA and release

**Files:**
- Verify: `index.html`, `styles.css`, `app.js`, `work-page.js`

- [ ] **Step 1: Check mobile and desktop**

At 390×844 inspect author section, open/close editorial panel, contact links, TV-project separator, a portrait artist page and Golos page. At 1440×960 check the same. Confirm no crop, no grayscale on editorial/TV imagery, and no overflow.

- [ ] **Step 2: Publish**

Run `npm test`, push `main`, deploy with Vercel production scope `andykislov394-1347s-projects`, inspect Ready status, then fetch `https://aotrom.art/?v=author-profile` and verify the live HTML includes `editorial` and `ТВ-проекты`.
