const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('response', response => console.log('RESPONSE:', response.status(), response.url()));
  await page.goto('http://localhost:3001/dashboard', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 5000));
  await browser.close();
})();
