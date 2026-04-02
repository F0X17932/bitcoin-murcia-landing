const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://bitcoin-murcia.vercel.app';
const OUTPUT_DIR = '/root/.openclaw/workspace/projects/bitcoin-murcia/screenshots';

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 812 }
];

async function takeScreenshots() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });
    
    console.log(`Taking ${viewport.name} screenshot...`);
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for animations
    await new Promise(r => setTimeout(r, 2000));
    
    const screenshotPath = path.join(OUTPUT_DIR, `${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Saved: ${screenshotPath}`);
    
    await page.close();
  }

  await browser.close();
  console.log('All screenshots taken!');
}

takeScreenshots().catch(console.error);