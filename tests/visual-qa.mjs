import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const outputDir = '/tmp/aotroom-qa';

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

const gotoWithRetry = async (page, url, options) => {
  let lastError;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      await page.goto(url, options);
      return;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(250);
    }
  }
  throw lastError;
};

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 960 },
]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await gotoWithRetry(page, `${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  await page.locator('details.editorial__details').evaluate((details) => { details.open = true; });
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(300);

  const homeMetrics = await page.evaluate(() => ({
    bodyText: document.body.innerText,
    viewportWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    brokenImages: [...document.images]
      .filter((image) => new URL(image.src).origin === window.location.origin)
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.getAttribute('src')),
  }));

  assert.equal(/[↗←↓]/.test(homeMetrics.bodyText), false, `${viewport.name}: literal arrow glyph is visible`);
  assert.ok(homeMetrics.scrollWidth <= homeMetrics.viewportWidth, `${viewport.name}: home page overflows horizontally`);
  assert.deepEqual(homeMetrics.brokenImages, [], `${viewport.name}: local home images failed to load`);
  assert.equal(await page.locator('.editorial__image').count(), 8, `${viewport.name}: editorial playlist image count`);
  assert.equal(await page.locator('.gallery__image img').count(), 3, `${viewport.name}: author gallery image count`);
  await page.locator('#video').scrollIntoViewIfNeeded();
  await page.locator('#video').screenshot({ path: `${outputDir}/video-${viewport.name}.png` });
  await page.locator('.video-feature__poster').click();
  const embeddedVideo = page.locator('.video-feature__frame iframe');
  assert.ok(await embeddedVideo.isVisible(), `${viewport.name}: embedded video opens from poster`);
  assert.match(await embeddedVideo.getAttribute('src'), /youtube-nocookie\.com\/embed\/P0LLevJQ9oM/);
  await page.screenshot({ path: `${outputDir}/home-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/kauzatsiya/`, { waitUntil: 'networkidle' });
  const releases = page.locator('.work-page__links li');
  assert.equal(await releases.count(), 8, `${viewport.name}: Kauzatsiya release count`);
  assert.match(await releases.first().innerText(), /От меня до тебя/i);
  assert.ok(await releases.first().locator('.release-label--album img').isVisible(), `${viewport.name}: album stamp image is visible`);
  const externalIconVisible = await page.locator('.external-icon').first().isVisible();
  if (viewport.name === 'mobile') {
    assert.equal(externalIconVisible, false, `${viewport.name}: external icon is hidden`);
  } else {
    assert.equal(externalIconVisible, true, `${viewport.name}: CSS external icon is visible`);
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: Kauzatsiya page overflows horizontally`);
  await page.screenshot({ path: `${outputDir}/kauzatsiya-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/aotrom/`, { waitUntil: 'networkidle' });
  const aotromImage = page.locator('.work-page__polaroid img');
  assert.match(await aotromImage.getAttribute('src'), /assets\/characters\/aotrom\.jpg$/);
  assert.ok(await aotromImage.evaluate((image) => image.complete && image.naturalWidth > 0), `${viewport.name}: aotrom portrait is loaded`);
  await page.screenshot({ path: `${outputDir}/aotrom-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/laren/`, { waitUntil: 'networkidle' });
  const larenImage = page.locator('.work-page__polaroid img');
  assert.match(await larenImage.getAttribute('src'), /assets\/characters\/laren\.jpg$/);
  assert.ok(await larenImage.evaluate((image) => image.complete && image.naturalWidth > 0), `${viewport.name}: LAREN portrait is loaded`);
  await page.screenshot({ path: `${outputDir}/laren-${viewport.name}.png`, fullPage: true });

  assert.deepEqual(consoleErrors, [], `${viewport.name}: browser console errors`);
  await context.close();
}

await browser.close();
console.log(`visual QA passes; screenshots: ${outputDir}`);
