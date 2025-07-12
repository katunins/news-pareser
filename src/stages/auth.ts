import { Browser, Builder, By, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome';

export async function openMediumAndClickStartReading() {
    const options = new chrome.Options()
    // .addArguments('--headless=new')      // современный headless
    // .addArguments('--disable-gpu')       // для Docker/CI
    // .addArguments('--window-size=1280,800'); // задаём разумный viewport
    options.addArguments('--headless=new')
    options.addArguments("--headless")
    let driver = new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(options)
        .build();

    try {
        console.log('Открываю сайт Medium.com...');
        await driver.get('https://medium.com/');

        // Ждем загрузки страницы
        await driver.sleep(3000);

        // Добавляем отладку - посмотрим все кнопки на странице
        console.log('Ищу кнопку "Start reading"...');

        // Ищем кнопку по тексту "Start reading"
        const button = await driver.findElement(By.xpath("//button[contains(normalize-space(), 'Start')]"));

        // Ждем, пока кнопка станет видимой
        await driver.wait(until.elementIsVisible(button), 5000);

        console.log('Кнопка "Start reading" найдена по тексту!');

        // Кликаем по кнопке
        await button.click();
        console.log('Кнопка "Start reading" нажата!');

        // Ждем немного после клика
        await driver.sleep(3000);

    } catch (error) {
        console.error('Ошибка при работе с Medium.com:', error);
    } finally {
        await driver.quit();
    }
}

export async function auth() {
    await openMediumAndClickStartReading();
}