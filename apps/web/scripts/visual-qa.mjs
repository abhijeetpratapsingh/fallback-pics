#!/usr/bin/env node

const baseUrl = (process.env.VISUAL_QA_BASE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const outputDir = process.env.VISUAL_QA_OUTPUT_DIR || 'visual-qa-output';

const routes = [
  { name: 'home', path: '/' },
  { name: 'placeholder-generator', path: '/placeholder-image-generator/' },
  { name: 'placeholder-api', path: '/placeholder-image-api/' },
  { name: 'docs', path: '/docs/' },
];

const viewports = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 1000 },
];

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.error('Playwright is not installed. Install it before running visual QA: pnpm --filter @fallback-pics/web add -D playwright');
  process.exit(1);
}

const fs = await import('node:fs/promises');
await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const failures = [];

for (const route of routes) {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const consoleMessages = [];
    page.on('console', (message) => {
      if (['warning', 'error'].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
    });

    const url = `${baseUrl}${route.path}`;
    await page.goto(url, { waitUntil: 'networkidle' });

    if (route.name === 'home' && viewport.name === 'mobile') {
      await page.getByRole('button', { name: /open navigation menu/i }).click();
      await page.screenshot({ path: `${outputDir}/${route.name}-${viewport.name}-menu-open.png`, fullPage: false });
      await page.getByRole('button', { name: /close navigation menu/i }).click();
    }

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) failures.push(`${route.path} ${viewport.name} has horizontal overflow ${overflow}px`);
    if (consoleMessages.length > 0) failures.push(`${route.path} ${viewport.name} console messages: ${consoleMessages.join('; ')}`);

    await page.screenshot({ path: `${outputDir}/${route.name}-${viewport.name}.png`, fullPage: false });
    await page.close();
  }
}

await browser.close();

if (failures.length > 0) {
  console.error(`Visual QA found ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Visual QA screenshots written to ${outputDir}`);
console.log('Manual review points: first fold, CTA density, builder visibility, sidebar overlap, code containment, mobile menu clarity, and builder usability.');
