import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173';
const outputDir = '/tmp/aotrom-qa';

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
  const inquiryRequests = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  await page.route('**/api/inquiry', async (route) => {
    inquiryRequests.push(route.request().postDataJSON());
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });

  await gotoWithRetry(page, `${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
  await page.locator('details.editorial__details').evaluate((details) => { details.open = true; });
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() => [...document.images]
    .filter((image) => new URL(image.src).origin === window.location.origin)
    .every((image) => image.complete), undefined, { timeout: 10_000 });

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
  assert.equal(await page.locator('.editorial__image').count(), 10, `${viewport.name}: editorial playlist image count`);
  assert.equal(await page.locator('.gallery__image img').count(), 3, `${viewport.name}: author gallery image count`);

  await page.locator('#process').scrollIntoViewIfNeeded();
  assert.equal(await page.locator('.process-step').count(), 5, `${viewport.name}: process step count`);
  await page.locator('#process').screenshot({ path: `${outputDir}/process-${viewport.name}.png` });

  await page.locator('#inquiry').scrollIntoViewIfNeeded();
  const inquiryHeight = await page.locator('#inquiry').evaluate((element) => element.getBoundingClientRect().height);
  if (viewport.name === 'mobile') assert.ok(inquiryHeight <= 860, `${viewport.name}: inquiry section is compact enough`);
  const inquiryColumns = await page.locator('.inquiry__grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  assert.equal(inquiryColumns, viewport.name === 'mobile' ? 1 : 2, `${viewport.name}: inquiry column layout`);
  await page.locator('.inquiry__submit').click();
  assert.match(await page.locator('#services-error').innerText(), /Выберите хотя бы одну услугу/);
  assert.match(await page.locator('#telegram-error').innerText(), /Укажите корректный ник/);
  assert.match(await page.locator('#consent-error').innerText(), /Подтвердите согласие/);
  await page.locator('label.service-option').filter({ hasText: 'песня под ключ' }).click();
  await page.locator('label.service-option').filter({ hasText: 'сведение вокала' }).click();
  await page.locator('#telegram-handle').fill('music_client');
  await page.locator('#project-brief').fill('Нужна аранжировка и сведение демо.');
  await page.locator('.consent-option input').check();
  await page.evaluate(() => {
    window.open = (url) => { window.__openedTelegramUrl = url; };
  });
  await page.locator('.inquiry__submit').click();
  await page.getByText('Заявка отправлена. Андрей ответит вам в Telegram.').waitFor({ timeout: 5_000 });
  assert.equal(await page.evaluate(() => window.__openedTelegramUrl), undefined, `${viewport.name}: Telegram fallback is not opened on API success`);
  assert.equal(inquiryRequests.length, 1, `${viewport.name}: one inquiry API request`);
  assert.deepEqual(inquiryRequests[0], {
    services: ['песня под ключ', 'сведение вокала'],
    telegram: '@music_client',
    brief: 'Нужна аранжировка и сведение демо.',
    consent: true,
    website: '',
  });
  await page.mouse.move(2, 2);
  await page.locator('#inquiry').screenshot({ path: `${outputDir}/inquiry-${viewport.name}.png` });

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
  assert.ok(await page.locator('.work-page__brand img').isVisible(), `${viewport.name}: aotrom logo is visible on project page`);
  const aotromImage = page.locator('.work-page__polaroid img');
  assert.match(await aotromImage.getAttribute('src'), /assets\/characters\/aotrom\.jpg$/);
  assert.ok(await aotromImage.evaluate((image) => image.complete && image.naturalWidth > 0), `${viewport.name}: aotrom portrait is loaded`);
  await page.screenshot({ path: `${outputDir}/aotrom-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/laren/`, { waitUntil: 'networkidle' });
  const larenImage = page.locator('.work-page__polaroid img');
  assert.match(await larenImage.getAttribute('src'), /assets\/characters\/laren\.jpg$/);
  assert.ok(await larenImage.evaluate((image) => image.complete && image.naturalWidth > 0), `${viewport.name}: LAREN portrait is loaded`);
  await page.screenshot({ path: `${outputDir}/laren-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/vladimir-shirokov/`, { waitUntil: 'networkidle' });
  const vladimirImage = page.locator('.work-page__polaroid img');
  assert.match(await vladimirImage.getAttribute('src'), /assets\/characters\/vladimir-shirokov\.jpg$/);
  assert.ok(await vladimirImage.evaluate((image) => image.complete && image.naturalWidth > 0), `${viewport.name}: Vladimir portrait is loaded`);
  assert.match(await vladimirImage.evaluate((image) => getComputedStyle(image).filter), /grayscale/);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: Vladimir page overflows horizontally`);
  await page.screenshot({ path: `${outputDir}/vladimir-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/altro-coro/`, { waitUntil: 'networkidle' });
  const altroImage = page.locator('.work-page__polaroid img');
  assert.match(await altroImage.getAttribute('src'), /assets\/characters\/altro-coro\.jpg$/);
  assert.ok(await altroImage.evaluate((image) => image.complete && image.naturalWidth > 0), `${viewport.name}: ALTRO CORO image is loaded`);
  assert.ok(await page.getByText('Городок').isVisible(), `${viewport.name}: ALTRO CORO track is renamed`);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: ALTRO CORO page overflows horizontally`);
  await page.screenshot({ path: `${outputDir}/altro-coro-${viewport.name}.png`, fullPage: true });

  await gotoWithRetry(page, `${baseUrl}/viktoriya-solomakhina/`, { waitUntil: 'networkidle' });
  assert.ok(await page.getByText('Городок', { exact: true }).isVisible(), `${viewport.name}: Victoria track is renamed`);
  assert.equal(await page.getByText('Мой городок', { exact: true }).count(), 0, `${viewport.name}: old Victoria title is absent`);

  await gotoWithRetry(page, `${baseUrl}/other-projects/`, { waitUntil: 'networkidle' });
  assert.ok(await page.getByText('Остальные работы', { exact: true }).isVisible(), `${viewport.name}: other projects title is renamed`);
  for (const title of ['Алиса Соловьева — Вода', 'Алиса Соловьева — Это искусство', 'Наталья Луч — NO MATTER', 'keira, aotrom — Неважно']) {
    assert.ok(await page.getByText(title, { exact: true }).isVisible(), `${viewport.name}: other work ${title}`);
  }
  const blackRaven = page.locator('.work-page__links li').filter({ hasText: 'Чёрный ворон' });
  assert.equal(await blackRaven.count(), 1, `${viewport.name}: Black Raven entry exists`);
  assert.match(await blackRaven.locator('a').first().getAttribute('href'), /vkvideo\.ru\/video-41774259_456245737/);
  assert.match(await blackRaven.locator('.work-page__secondary-link').getAttribute('href'), /music\.yandex\.ru\/album\/32393365/);
  await blackRaven.screenshot({ path: `${outputDir}/black-raven-${viewport.name}.png` });

  await gotoWithRetry(page, `${baseUrl}/alya/`, { waitUntil: 'networkidle' });
  const alyaNewTrack = page.locator('.work-page__links li').filter({ hasText: 'не пиши' });
  assert.equal(await alyaNewTrack.count(), 1, `${viewport.name}: ALYA new track exists`);
  assert.equal(await alyaNewTrack.locator('a').first().getAttribute('href'), 'https://band.link/nYAGx');

  await gotoWithRetry(page, `${baseUrl}/vladimir-shirokov/`, { waitUntil: 'networkidle' });
  const shirokovNewTrack = page.locator('.work-page__links li').filter({ hasText: 'Золото твоих волос' });
  assert.equal(await shirokovNewTrack.count(), 1, `${viewport.name}: Shirokov new track exists`);

  await gotoWithRetry(page, `${baseUrl}/golos/`, { waitUntil: 'networkidle' });
  for (const title of [
    '«You Raise Me Up» — Фахриддин Хакимов и Софья Льорет',
    '«Ах ты, степь широкая» — Евгений Курчич, Александр Власенков',
    'Алина Калашникова — Больно',
  ]) {
    assert.ok(await page.getByText(title, { exact: true }).isVisible(), `${viewport.name}: Voice title ${title}`);
  }
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: Voice page overflows horizontally`);
  await page.screenshot({ path: `${outputDir}/golos-${viewport.name}.png`, fullPage: true });

  for (const legalPath of ['privacy', 'consent']) {
    await gotoWithRetry(page, `${baseUrl}/${legalPath}/`, { waitUntil: 'networkidle' });
    assert.ok(await page.locator('.legal-page h1').isVisible(), `${viewport.name}: ${legalPath} heading`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${viewport.name}: ${legalPath} overflows horizontally`);
    await page.screenshot({ path: `${outputDir}/${legalPath}-${viewport.name}.png`, fullPage: true });
  }

  assert.deepEqual(consoleErrors, [], `${viewport.name}: browser console errors`);
  await context.close();
}

await browser.close();
console.log(`visual QA passes; screenshots: ${outputDir}`);
