import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { chromium } from 'playwright-core';
import { modes } from '../src/prompts.js';

const origin = new URL(process.argv[2] ?? 'http://localhost:5173').origin;
const executablePath = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
assert.ok(executablePath, 'Chrome or Edge is needed for this browser check.');
const profile = mkdtempSync(join(tmpdir(), 'shot-saved-'));
const options = { executablePath, headless: true, viewport: { width: 390, height: 844 } };
const prompt = modes[0].prompts[0];
const failures = [];
let context;
function track(page) { page.on('pageerror', (error) => failures.push(error.message)); }
async function openSaved(page) { await page.getByRole('button', { name: 'Saved', exact: true }).click(); }
const card = (page) => page.getByRole('button', { name: `Show prompt 1: ${prompt.text}`, exact: true });

try {
  context = await chromium.launchPersistentContext(profile, options);
  let page = context.pages()[0];
  track(page);
  await page.goto(origin);
  await page.getByRole('main', { name: 'SHOT walkthrough' }).waitFor();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Get started', exact: true }).click();
  await openSaved(page);
  await page.getByText('Your saved prompts are looking lonely.', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  await page.getByRole('button', { name: `${modes[0].name} ${modes[0].description}`, exact: true }).click();
  const save = page.getByRole('button', { name: `Save prompt: ${prompt.text}`, exact: true });
  await save.click();
  assert.equal(await page.getByRole('region', { name: 'Show prompt', exact: true }).count(), 0, 'Save must not open Show Mode');
  assert.equal(await page.getByRole('button', { name: `Unsave prompt: ${prompt.text}`, exact: true }).getAttribute('aria-pressed'), 'true');
  const wrapper = page.locator('.prompt-card-wrap').first();
  const bounds = await wrapper.boundingBox();
  const heart = await wrapper.locator('.save-button').boundingBox();
  const counter = await wrapper.locator('.card-counter').boundingBox();
  assert.ok(heart.x > bounds.x + bounds.width / 2 && heart.y < bounds.y + bounds.height / 2, 'Save is top-right');
  assert.ok(counter.x > bounds.x + bounds.width / 2 && counter.y > bounds.y + bounds.height / 2, 'Counter is bottom-right');
  mkdirSync('.impeccable/review', { recursive: true });
  await page.screenshot({ path: '.impeccable/review/saved-deck.png', fullPage: true });
  await openSaved(page);
  assert.equal(await page.locator('.prompt-card').count(), 1);
  await page.screenshot({ path: '.impeccable/review/saved-page.png', fullPage: true });
  await context.close();
  context = await chromium.launchPersistentContext(profile, options);
  page = context.pages()[0];
  track(page);
  await page.goto(origin);
  await openSaved(page);
  await card(page).waitFor();
  assert.equal(await page.locator('.prompt-card').count(), 1, 'Save survives closing and restarting the browser');
  await card(page).click();
  const show = page.getByRole('region', { name: 'Show prompt', exact: true });
  assert.equal(await show.getByRole('button').count(), 3, 'Existing two answers and close are preserved');
  assert.equal(await page.getByRole('navigation').count(), 0);
  await show.getByRole('button', { name: 'Close prompt', exact: true }).click();
  await page.getByRole('heading', { name: 'Saved', exact: true }).waitFor();
  await card(page).click();
  await page.goBack();
  await page.getByRole('heading', { name: 'Saved', exact: true }).waitFor();
  await card(page).click();
  await page.getByRole('button', { name: prompt.no, exact: true }).click();
  await page.getByRole('main', { name: 'Negative response' }).waitFor();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await openSaved(page);
  await page.getByRole('button', { name: `Unsave prompt: ${prompt.text}`, exact: true }).click();
  await page.getByText('Your saved prompts are looking lonely.', { exact: true }).waitFor();
  await page.reload();
  await openSaved(page);
  assert.equal(await page.locator('.prompt-card').count(), 0, 'Removal survives reload');
  await page.getByRole('button', { name: 'Home', exact: true }).click();
  for (const [index, mode] of modes.entries()) {
    await page.getByRole('button', { name: `${mode.name} ${mode.description}`, exact: true }).click();
    await page.getByRole('button', { name: `Save prompt: ${mode.prompts[0].text}`, exact: true }).click();
    await page.getByRole('button', { name: 'Home', exact: true }).click();
    await openSaved(page);
    assert.equal(await page.locator('.prompt-card').count(), index + 1, 'Saves from different modes accumulate');
    await page.getByRole('button', { name: 'Home', exact: true }).click();
  }
  await openSaved(page);
  for (const [name, width, height] of [['small', 320, 568], ['desktop', 1440, 1000]]) {
    await page.setViewportSize({ width, height });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `.impeccable/review/saved-${name}.png`, fullPage: true });
  }
  assert.deepEqual(failures, []);
  console.log(`PASS ${origin}: empty Saved, independent save control, heart and counter positions, browser restart persistence, saved-card handover and back, removal persistence, six modes, small/desktop layout.`);
} finally {
  await context?.close();
  assert.ok(resolve(profile).startsWith(`${resolve(tmpdir())}${sep}shot-saved-`), 'Only remove this test browser profile');
  rmSync(profile, { recursive: true, force: true });
}
