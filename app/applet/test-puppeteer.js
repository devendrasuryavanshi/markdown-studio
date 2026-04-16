import puppeteer from 'puppeteer';

async function test() {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent('<h1>Hello World</h1>');
    const pdf = await page.pdf();
    console.log('PDF generated, size:', pdf.length);
    await browser.close();
  } catch (e) {
    console.error('Error:', e);
  }
}
test();
