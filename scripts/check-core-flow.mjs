import assert from 'node:assert/strict';
import { existsSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { modes } from '../src/prompts.js';

const url = process.argv[2] ?? 'http://localhost:5173';
const executablePath = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
assert.ok(executablePath, 'Install Chrome or Edge to run the phone-flow check.');
mkdirSync('.impeccable/review', { recursive: true });
const browser = await chromium.launch({ executablePath, headless: true });
const failures = [];
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
// This check covers the existing handover flow for a returning visitor.
await page.addInitScript(() => localStorage.setItem('shot.intro.complete.v1', '1'));
page.on('pageerror', (error) => failures.push(error.message));
page.on('response', (response) => { if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
const screenshot = (name) => page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true, animations: 'disabled' });

try {
  await page.goto(url);
  await page.getByRole('heading', { name: "Don't know what to say? Show them." }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.getByRole('button').filter({ has: page.getByRole('heading', { level: 2 }) }).count(), 6);
  await screenshot('mobile');
  for (const [modeIndex, mode] of modes.entries()) {
    await page.getByRole('button', { name: `${mode.name} ${mode.description}`, exact: true }).click();
    await page.getByRole('heading', { name: mode.name, exact: true }).waitFor();
    if (!modeIndex) await screenshot('deck');
    for (const [index, prompt] of mode.prompts.entries()) {
      const card = page.getByRole('button', { name: `Show prompt ${index + 1}: ${prompt.text}`, exact: true });
      await card.click();
      const show = page.getByRole('region', { name: 'Show prompt' });
      await show.getByRole('heading', { name: prompt.text, exact: true }).waitFor();
      assert.equal(await show.getByRole('button').count(), 3);
      assert.equal(await page.getByRole('navigation').count(), 0, 'Navigation is hidden while showing a prompt');
      assert.equal(await show.getByText('Tap to show', { exact: true }).count(), 0);
      const yes = show.getByRole('button', { name: prompt.yes, exact: true });
      const no = show.getByRole('button', { name: prompt.no, exact: true });
      const y = await yes.boundingBox();
      const n = await no.boundingBox();
      assert.equal(y.width, n.width); assert.equal(y.height, n.height);
      assert.ok(n.y + n.height <= 844, 'Both answers fit on a typical phone');
      if (!modeIndex && !index) await screenshot('show');
      await show.getByRole('button', { name: 'Close prompt', exact: true }).click();
      await page.getByRole('heading', { name: mode.name, exact: true }).waitFor();
      assert.ok(await card.isVisible(), 'Closing returns to the selected prompt');
    }
    const premium = page.getByRole('region', { name: 'Premium preview', exact: true });
    await premium.scrollIntoViewIfNeeded({ timeout: 5000 });
    await premium.getByRole('heading', { name: "You've got more shots to take.", exact: true }).waitFor();
    assert.equal(await premium.getByText('Premium · coming soon', { exact: true }).count(), 1);
    await premium.getByRole('button', { name: 'Unlock Premium', exact: true }).click({ timeout: 3000 });
    const comingSoon = page.getByRole('main', { name: 'Premium coming soon', exact: true });
    await comingSoon.getByRole('heading', { name: 'Premium · coming soon', exact: true }).waitFor();
    assert.equal(await page.getByRole('navigation').count(), 0);
    assert.equal(await comingSoon.getByRole('button').count(), 1, 'Only a return action, no checkout');
    if (!modeIndex) await screenshot('premium-coming-soon');
    await comingSoon.getByRole('button', { name: 'Back to deck', exact: true }).click();
    await premium.getByRole('button', { name: 'Unlock Premium', exact: true }).waitFor();
    await premium.getByRole('button', { name: 'Unlock Premium', exact: true }).click();
    await page.goBack();
    await premium.getByRole('button', { name: 'Unlock Premium', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: /^Show prompt / }).count(), 5, 'Only five prompts can be opened');
    if (!modeIndex) await screenshot('premium-mobile');
    await premium.getByRole('button', { name: 'Maybe later', exact: true }).click();
    const fifthCard = page.getByRole('button', { name: `Show prompt 5: ${mode.prompts[4].text}`, exact: true });
    const fifthBounds = await fifthCard.boundingBox();
    assert.ok(fifthBounds.y >= 0 && fifthBounds.y + fifthBounds.height <= 844, 'Maybe later returns to the fifth free prompt');
    // Scroll backward, then complete both possible answers.
    const firstCard = page.getByRole('button', { name: `Show prompt 1: ${mode.prompts[0].text}`, exact: true });
    for (const [answer, text] of [
      ['yes', 'Well… looks like it’s your move now 👀'],
      ['no', 'Respect. We pretend this never happened 🤝'],
    ]) {
      if (answer === 'no') await page.getByRole('button', { name: `${mode.name} ${mode.description}`, exact: true }).click();
      await firstCard.click();
      await page.getByRole('button', { name: mode.prompts[0][answer], exact: true }).click();
      await page.getByRole('heading', { name: text, exact: true }).waitFor();
      assert.equal(await page.getByRole('button').count(), 1, 'The result only offers Done');
      if (!modeIndex) await screenshot(answer === 'yes' ? 'positive' : 'negative');
      await page.getByRole('button', { name: 'Done', exact: true }).click();
      await page.getByRole('heading', { name: "Don't know what to say? Show them." }).waitFor();
    }
  }
  await page.getByRole('button', { name: `${modes[0].name} ${modes[0].description}`, exact: true }).click();
  await page.getByRole('button', { name: `Show prompt 1: ${modes[0].prompts[0].text}`, exact: true }).click();
  await page.goBack();
  await page.getByRole('heading', { name: modes[0].name, exact: true }).waitFor();
  await page.getByRole('button', { name: 'Back to intentions', exact: true }).click();
  await page.setViewportSize({ width: 320, height: 568 });
  await page.getByRole('button', { name: `${modes[4].name} ${modes[4].description}`, exact: true }).click();
  const smallPremium = page.getByRole('region', { name: 'Premium preview', exact: true });
  await smallPremium.evaluate((element) => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await screenshot('premium-small-phone');
  await smallPremium.getByRole('button', { name: 'Unlock Premium', exact: true }).click();
  await page.getByRole('main', { name: 'Premium coming soon', exact: true }).waitFor();
  const returnBounds = await page.getByRole('button', { name: 'Back to deck', exact: true }).boundingBox();
  assert.ok(returnBounds.y + returnBounds.height <= 568, 'Return action fits on a small phone');
  await screenshot('premium-coming-soon-small');
  await page.keyboard.press('Escape');
  await smallPremium.waitFor();
  await smallPremium.getByRole('button', { name: 'Maybe later', exact: true }).scrollIntoViewIfNeeded();
  await screenshot('premium-small-phone-actions');
  await smallPremium.getByRole('button', { name: 'Maybe later', exact: true }).click();
  await page.getByRole('button', { name: `Show prompt 1: ${modes[4].prompts[0].text}`, exact: true }).click();
  await page.getByRole('heading', { name: modes[4].prompts[0].text, exact: true }).waitFor();
  assert.ok(await page.getByRole('button', { name: 'NO THANKS', exact: true }).isVisible());
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'No horizontal overflow');
  await screenshot('small-phone');
  await page.getByRole('button', { name: 'Close prompt', exact: true }).click();
  await page.getByRole('button', { name: 'Back to intentions', exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await screenshot('desktop');
  await page.getByRole('button', { name: `${modes[0].name} ${modes[0].description}`, exact: true }).click();
  await page.getByRole('region', { name: 'Premium preview', exact: true }).scrollIntoViewIfNeeded();
  await screenshot('premium-desktop');
  await page.getByRole('button', { name: 'Unlock Premium', exact: true }).click();
  await page.getByRole('main', { name: 'Premium coming soon', exact: true }).waitFor();
  await screenshot('premium-coming-soon-desktop');
  await page.getByRole('button', { name: 'Back to deck', exact: true }).click();
  assert.deepEqual(failures, [], 'No browser errors or failed assets');
  console.log(`PASS ${url}: six intentions, all 30 free prompts, locked sixth previews, Maybe later, close/back, both answers, Done, and small-phone layout.`);
} finally {
  await browser.close();
}
