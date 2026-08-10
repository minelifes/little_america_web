import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
page.on('pageerror', (err) => console.log('PAGE ERROR:', err.message));
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: '/tmp/home.png', fullPage: true });
await browser.close();
console.log('done');
