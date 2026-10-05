import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const origin = new URL(process.argv[2] ?? 'http://localhost:5173').origin;
const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert.ok(executablePath, 'Chrome or Edge is needed for this browser check.');
mkdirSync('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const failures = [];
page.on('pageerror', (error) => failures.push(error.message));
page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });

try {
  for (const [name, width, height] of [['mobile', 390, 844], ['small-phone', 320, 568], ['desktop', 1440, 1000]]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${origin}/start`);
    await page.getByRole('link', { name: 'Try SHOT', exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.getByRole('link').count(), 1, 'Exactly one action');
    assert.equal(await page.getByRole('button').count(), 0, 'The example answers are not fake buttons');
    assert.equal(await page.getByRole('navigation').count(), 0, 'App navigation stays on the app');
    assert.equal(await page.getByRole('link', { name: 'Try SHOT', exact: true }).getAttribute('href'), '/');
    await page.getByText('Pick a prompt. Show your phone.').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= width, 'Content stays inside the configured phone width');
    await page.screenshot({ path: `.impeccable/review/start-${name}.png`, fullPage: true, animations: 'disabled' });
    await page.reload();
    await page.getByRole('link', { name: 'Try SHOT', exact: true }).click();
    await page.waitForURL(`${origin}/`);
    await page.getByRole('button', { name: "Make a move Let them know you're interested.", exact: true }).waitFor();
    assert.equal(await page.getByRole('heading', { level: 2 }).count(), 6, 'All six original intentions remain at root');
    await page.goBack();
    await page.getByRole('link', { name: 'Try SHOT', exact: true }).waitFor();
  }
  await page.goto(`${origin}/start/`);
  await page.getByRole('link', { name: 'Try SHOT', exact: true }).waitFor();
  assert.deepEqual(failures, [], 'No failed assets or browser errors');
  console.log(`PASS ${origin}/start: phone and desktop layouts, one Try SHOT action, reload, trailing slash, and return to the unchanged six intentions.`);
} finally { await browser.close(); }
