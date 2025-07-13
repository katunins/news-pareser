import puppeteer from 'puppeteer'

async function app() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.goto('https://medium.com/');
    await page.setViewport({ width: 1080, height: 1024 });
    const textSelector = await page
        .locator('text/Sign in')
        .waitHandle();
    console.log('textSelector', textSelector)
}

app()