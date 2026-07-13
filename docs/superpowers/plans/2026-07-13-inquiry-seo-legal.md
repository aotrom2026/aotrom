# Inquiry Form, SEO and Legal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a working Telegram inquiry flow, correct portfolio content, publish legal pages, and make the static site crawl-ready.

**Architecture:** Keep the site static. `inquiry-form.js` owns validation and Telegram draft creation, while HTML/CSS provide the editorial two-column form. Legal pages are plain HTML and SEO metadata is server-independent.

**Tech Stack:** Static HTML, CSS, JavaScript ES modules, Node contract tests, Playwright browser QA, Vercel static hosting.

---

### Task 1: Portfolio corrections

**Files:**
- Modify: `portfolio-data.js`
- Modify: `tests/character-pages.mjs`

- [ ] Write failing assertions that Victoria contains `Городок` but not `Мой городок`, other projects contain both VK Video and Yandex Music links for `Чёрный ворон`, and Voice uses `Алина Калашникова — Больно`.
- [ ] Run `node tests/character-pages.mjs` and confirm the assertions fail for missing content.
- [ ] Make the minimal data changes in `portfolio-data.js`.
- [ ] Run `node tests/character-pages.mjs` and confirm it passes.

### Task 2: Telegram inquiry form

**Files:**
- Create: `inquiry-form.js`
- Create: `tests/inquiry-form.mjs`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `package.json`

- [ ] Add a failing unit test for `normalizeTelegramHandle()` and `buildTelegramDraft()` and failing contract assertions for the nine services, consent, and form script.
- [ ] Run `node tests/inquiry-form.mjs` and `node tests/page-contract.mjs`; confirm the expected failures.
- [ ] Implement the two pure functions and progressive-enhancement submit handler that opens `https://t.me/aotrom0?text=<encoded draft>` only after native validation.
- [ ] Add semantic form markup with a checkbox fieldset, Telegram field, separate consent checkbox, error/status region, and no data-collection endpoint.
- [ ] Add responsive editorial form styles, clear focus states, selected states, and single-column mobile layout.
- [ ] Add the new unit test to `npm test` and confirm the full suite passes.

### Task 3: Legal documents and client checklist

**Files:**
- Create: `privacy/index.html`
- Create: `consent/index.html`
- Create: `CLIENT-CHECKLIST.md`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/page-contract.mjs`

- [ ] Add failing tests for footer policy links, separate policy pages, operator identity, Telegram-only transfer disclosure, and no analytics/cookie claims.
- [ ] Run `node tests/page-contract.mjs` and confirm failure.
- [ ] Add concise legal pages using known operator information and a checklist for missing client confirmations.
- [ ] Add policy links to the footer and shared legal-page styling.
- [ ] Run the contract test and confirm it passes.

### Task 4: Technical SEO

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`
- Modify: `index.html`
- Modify: every project `index.html`
- Modify: `tests/page-contract.mjs`
- Modify: `tests/character-pages.mjs`

- [ ] Add failing assertions for canonical URLs, social image metadata, JSON-LD Person/WebSite/services, robots sitemap reference, and sitemap coverage.
- [ ] Run the contract tests and confirm the expected failures.
- [ ] Implement homepage metadata and JSON-LD, then add unique canonical/Open Graph tags to project pages.
- [ ] Create `robots.txt` and `sitemap.xml` with all public pages.
- [ ] Run `npm test` and confirm every assertion passes.

### Task 5: Browser QA and deployment

**Files:**
- Modify: `tests/visual-qa.mjs`

- [ ] Extend Playwright QA to inspect form layout at 390x844 and 1440x960, validate empty submission, select two services, fill a Telegram handle, and verify the encoded Telegram draft URL.
- [ ] Start the local server with the bundled helper and run visual QA; inspect the generated screenshots.
- [ ] Run `npm test`, `git diff --check`, and the full browser QA again.
- [ ] Commit and push `main`, then verify production HTML, robots, sitemap, form, policies, and corrected portfolio strings with fresh HTTP requests.

