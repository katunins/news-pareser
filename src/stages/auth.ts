import { Browser, Builder, By, until } from 'selenium-webdriver'
import { Options as ChromeOptions } from 'selenium-webdriver/chrome'
import { Options as FirefoxOptions } from 'selenium-webdriver/firefox'

export async function openMediumAndClickStartReading() {
    // Пробуем сначала Chrome, если не получится - Firefox
    let driver;

    try {
        console.log('Пробуем запустить Chrome...');
        const chromeOptions = new ChromeOptions();
        chromeOptions.addArguments('--headless');
        chromeOptions.addArguments('--no-sandbox');
        chromeOptions.addArguments('--disable-dev-shm-usage');
        chromeOptions.addArguments('--disable-gpu');
        chromeOptions.addArguments('--disable-extensions');
        chromeOptions.addArguments('--disable-plugins');
        chromeOptions.addArguments('--disable-images');
        chromeOptions.addArguments('--disable-javascript');
        chromeOptions.addArguments('--disable-web-security');
        chromeOptions.addArguments('--allow-running-insecure-content');
        chromeOptions.addArguments('--disable-background-timer-throttling');
        chromeOptions.addArguments('--disable-backgrounding-occluded-windows');
        chromeOptions.addArguments('--disable-renderer-backgrounding');
        chromeOptions.addArguments('--disable-features=TranslateUI');
        chromeOptions.addArguments('--disable-ipc-flooding-protection');
        chromeOptions.addArguments('--user-data-dir=/tmp/chrome-user-data-' + Date.now());
        chromeOptions.addArguments('--remote-debugging-port=0');

        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(chromeOptions)
            .build();
        console.log('Chrome запущен успешно!');
    } catch (error) {
        console.log('Chrome не удалось запустить, пробуем Firefox...');
        const firefoxOptions = new FirefoxOptions();
        firefoxOptions.addArguments('--headless');

        driver = await new Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(firefoxOptions)
            .build();
        console.log('Firefox запущен успешно!');
    }

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