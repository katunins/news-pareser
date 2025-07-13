import puppeteer from 'puppeteer'

async function app() {
    const browser = await puppeteer.launch({
        args: [
            ' --no-sandbox'
        ]
    })
    const page = await browser.newPage();
    await page.goto('https://ikatunin.ru/');
    await page.setViewport({ width: 1080, height: 1024 });
    const textSelector = await page
        .locator('text/Павел')
        .waitHandle();
    console.log('textSelector', textSelector)
}

app()