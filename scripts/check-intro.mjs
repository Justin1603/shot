import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const origin = new URL(process.argv[2] ?? 'http://localhost:5173').origin;
const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert.ok(executablePath, 'Chrome or Edge is needed for this browser check.');
mkdirSync('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const failures = [];
const headings = [
  'YOU SEE SOMEONE YOU LIKE...',
  'YOU MEET SOMEONE NEW...',
  "YOU'RE ALREADY TALKING...",
  'WHATEVER THE MOMENT...',
];
const supportingCopy = [
  ['But have no idea what to say.', 'SHOT gives you a way in.'],
  ['And actually want to get to know them.', 'Skip the awkward small talk.'],
  ['But the conversation could use a little something.', 'Break the awkwardness. Get to know them. Make them laugh.'],
  ['Take a SHOT.', 'Pick a prompt.', 'Show them your phone.', 'See where it goes.'],
];

async function walkIntro(page, captureName, width) {
  await page.getByRole('main', { name: 'SHOT splash', exact: true }).waitFor();
  assert.equal(await page.getByRole('button').count(), 0, 'Splash advances without a button');
  if (captureName) await page.screenshot({ path: `.impeccable/review/intro-splash-${captureName}.png`, fullPage: true, animations: 'disabled' });
  for (const [step, heading] of headings.entries()) {
    const title = page.getByRole('heading', { level: 1, name: heading, exact: true });
    await title.waitFor();
    for (const line of supportingCopy[step]) await page.getByText(line, { exact: true }).waitFor();
    assert.equal(await page.getByRole('navigation').count(), 0, 'Existing navigation stays off the new screens');
    assert.equal(await page.getByRole('button').count(), 1);
    assert.equal(await title.evaluate((element) => element === document.activeElement), true, 'The new screen receives keyboard focus');
    if (width) assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= width, 'No horizontal overflow');
    if (captureName) await page.screenshot({ path: `.impeccable/review/intro-${step + 1}-${captureName}.png`, fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: step === 3 ? 'Get started' : 'Next', exact: true }).click();
  }
  await page.getByRole('button', { name: "Make a move Let them know you're interested.", exact: true }).waitFor();
  assert.equal(await page.getByRole('heading', { level: 2 }).count(), 6, 'Get started opens the six existing intentions');
}

try {
  for (const [name, width, height] of [['mobile', 390, 844], ['small-phone', 320, 568], ['desktop', 1440, 1000]]) {
    const context = await browser.newContext({ viewport: { width, height }, isMobile: name !== 'desktop', hasTouch: name !== 'desktop', reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    await page.goto(origin);
    await walkIntro(page, name, width);
    await page.getByRole('button', { name: "Make a move Let them know you're interested.", exact: true }).click();
    await page.getByRole('button', { name: 'Show prompt 1: Coffee sometime?', exact: true }).click();
    await page.getByRole('button', { name: 'NO THANKS', exact: true }).click();
    await page.getByRole('heading', { name: 'Respect. We pretend this never happened 🤝', exact: true }).waitFor();
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: "Make a move Let them know you're interested.", exact: true }).waitFor();
    assert.equal(await page.getByRole('main', { name: 'SHOT splash', exact: true }).count(), 0, 'Returning visits bypass the completed introduction');
    await page.goto(`${origin}/?intro`);
    await walkIntro(page);
    await page.reload();
    await walkIntro(page);
    await page.goto(origin);
    await page.getByRole('button', { name: "Make a move Let them know you're interested.", exact: true }).waitFor();
    assert.equal(await page.getByRole('main', { name: 'SHOT splash', exact: true }).count(), 0, 'Normal visits still bypass the introduction after the override');
    await page.goto(`${origin}/start`);
    await page.getByRole('link', { name: 'Try SHOT', exact: true }).waitFor();
    await context.close();
  }
  const freshContext = await browser.newContext();
  const freshPage = await freshContext.newPage();
  await freshPage.goto(`${origin}/start`);
  await freshPage.getByRole('link', { name: 'Try SHOT', exact: true }).click();
  await walkIntro(freshPage);
  await freshContext.close();
  const blockedContext = await browser.newContext();
  await blockedContext.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } });
  });
  const blockedPage = await blockedContext.newPage();
  await blockedPage.goto(origin);
  await walkIntro(blockedPage);
  await blockedContext.close();
  assert.deepEqual(failures, [], 'No browser errors or failed assets');
  console.log(`PASS ${origin}: automatic splash, exact four-screen copy, phone/desktop layouts, Get started, unchanged handover, returning visits, /start entry and storage-unavailable fallback.`);
} finally { await browser.close(); }
