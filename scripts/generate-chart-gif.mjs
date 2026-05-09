#!/usr/bin/env node
/**
 * One-off script: capture docs/team-bio-word-counts-chart.html as a GIF.
 * Run: npx puppeteer scripts/generate-chart-gif.mjs
 * Requires: npm install puppeteer sharp (or run once with npx)
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'docs', 'team-bio-word-counts-chart.html');
const outPath = path.join(projectRoot, 'docs', 'team-bio-word-counts.gif');

const htmlUrl = 'file://' + htmlPath;

async function main() {
  let puppeteer, sharp;
  try {
    puppeteer = (await import('puppeteer')).default;
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('Missing deps. Run: npm install puppeteer sharp');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 520, height: 420, deviceScaleFactor: 2 });
    await page.goto(htmlUrl, { waitUntil: 'networkidle0' });
    const pngBuffer = await page.screenshot({
      type: 'png',
      fullPage: false,
      clip: await page.evaluate(() => {
        const body = document.body;
        const wrap = document.querySelector('.chart-wrap');
        const legend = document.querySelector('.legend');
        const h1 = document.querySelector('h1');
        const subtitle = document.querySelector('.subtitle');
        const rect = body.getBoundingClientRect();
        const wrapRect = wrap ? wrap.getBoundingClientRect() : rect;
        const bottom = legend ? legend.getBoundingClientRect().bottom : wrapRect.bottom;
        const top = h1 ? h1.getBoundingClientRect().top : rect.top;
        return {
          x: Math.max(0, rect.left),
          y: Math.max(0, top - 8),
          width: Math.min(520, rect.width),
          height: Math.min(400, bottom - top + 24),
        };
      }),
    });

    await sharp(pngBuffer)
      .gif({ colours: 256, effort: 3 })
      .toFile(outPath);
    console.log('Wrote:', outPath);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
