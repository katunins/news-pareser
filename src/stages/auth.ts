import { Browser, Builder, By, until } from 'selenium-webdriver'
import { Options as ChromeOptions } from 'selenium-webdriver/chrome'

export async function openMediumAndClickStartReading() {
    const chromeOptions = new ChromeOptions();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--remote-debugging-port=9222');
    chromeOptions.addArguments('--user-data-dir=/tmp/chrome-user-data');

    const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOptions)
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