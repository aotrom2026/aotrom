# Content, Releases, Media and Mobile Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the site copy, Kauzatsiya release list, author/aotrom photography, YouTube feature and mobile-safe external-link icon while preserving the existing editorial design.

**Architecture:** Static content remains in `index.html`; portfolio release metadata remains in `portfolio-data.js` and is rendered by `work-page.js`. New media lives under `assets/author` and `assets/characters`. CSS owns the album stamp, responsive media treatment and a non-emoji external-link glyph.

**Tech Stack:** Static HTML, CSS, browser ES modules, Node assertion tests, Python Playwright.

---

### Task 1: Lock the content and release contracts

**Files:**
- Modify: `tests/page-contract.mjs`
- Modify: `tests/character-pages.mjs`

- [ ] **Step 1: Add failing assertions**

Assert the new seven-year lead, four exact chapter paragraphs, YouTube id, three new asset paths, four new Kauzatsiya URLs, first-position album, `label: 'album'`, and absence of literal `↗` in `app.js` and `work-page.js`.

- [ ] **Step 2: Run the tests to verify failure**

Run: `npm test`
Expected: FAIL on the first missing new content assertion.

### Task 2: Import photos and update data-driven releases

**Files:**
- Create: `assets/characters/aotrom.jpg`
- Create: `assets/gallery/andrey-wall-profile.jpg`
- Create: `assets/gallery/andrey-wall-wide.jpg`
- Modify: `portfolio-data.js`
- Modify: `work-page.js`

- [ ] **Step 1: Copy the three supplied photos**

Use `cp` for the exact user-provided source paths and stable destination names. Keep the original files untouched.

- [ ] **Step 2: Update portfolio metadata**

Set the aotrom entry image to `assets/characters/aotrom.jpg`. Add `{ label: 'album' }` to «От меня до тебя» and insert the four supplied releases immediately after it.

- [ ] **Step 3: Render optional release labels**

Extend the link helper and renderer so a label becomes `<span class="release-label">album</span>` next to the title.

### Task 3: Replace copy and add media blocks

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace author copy**

Use the four exact paragraphs supplied by the user and change the lead to “Более 7 лет профессионально занимаюсь созданием музыки.”

- [ ] **Step 2: Add GSN audio action**

Add an external-action row under «Другие форматы» with a safe search URL if no verified official domain is discoverable.

- [ ] **Step 3: Add video section**

Embed `https://www.youtube-nocookie.com/embed/P0LLevJQ9oM` with a 16:9 wrapper, title and direct YouTube fallback link.

- [ ] **Step 4: Update gallery**

Replace the two existing gallery image sources with the two new author photos and add the third composition only if needed; `IMG_0595.JPG` remains exclusive to aotrom.

### Task 4: Preserve style and remove emoji arrows

**Files:**
- Modify: `app.js`
- Modify: `work-page.js`
- Modify: `index.html`
- Modify: `styles.css`

- [ ] **Step 1: Replace literal external arrows**

Use `<span class="external-icon" aria-hidden="true"></span>` in generated and static external links.

- [ ] **Step 2: Draw the external icon in CSS**

Create a 0.72em square with border-top, border-right and a rotated diagonal line; never use an emoji-capable character.

- [ ] **Step 3: Style album stamp and video**

Make the album marker a small rotated outlined stamp. Keep the video section black, wide and editorial, with responsive title/action alignment.

- [ ] **Step 4: Add mobile rules**

At 700px, keep release title/label/action readable, use a single-column video heading and prevent horizontal overflow.

### Task 5: Verify and refine

**Files:**
- Create: `tests/visual-qa.mjs`

- [ ] **Step 1: Run contract tests**

Run: `npm test`
Expected: both contract scripts print `passes` and exit 0.

- [ ] **Step 2: Check source formatting**

Run: `git diff --check`
Expected: exit 0 with no output.

- [ ] **Step 3: Run Playwright visual QA**

Run the local server on port 4173 and execute Playwright at 390×844 and 1440×960. Assert no horizontal overflow, all local images load, video section exists, album is first, and screenshots are saved under `/tmp/aotrom-qa`.

- [ ] **Step 4: Inspect screenshots and fix defects**

Review desktop/mobile home and Kauzatsiya screenshots, correct any clipping or overlap, then repeat `npm test`, Playwright QA and `git diff --check`.
