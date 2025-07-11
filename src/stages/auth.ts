import { Browser, Builder, By, until } from 'selenium-webdriver'

export async function openMediumAndClickStartReading() {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
        console.log('Открываю сайт Medium.com...');
        await driver.get('https://medium.com/');

        // Ждем загрузки страницы
        await driver.sleep(3000);

        console.log('Ищу кнопку "Start reading"...');

        // Ждем появления кнопки (до 10 секунд)
        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Start reading')]")), 10000);

        // Ищем кнопку
        const button = await driver.findElement(By.xpath("//button[contains(text(), 'Start reading')]"));

        // Проверяем, что кнопка видима и кликабельна
        await driver.wait(until.elementIsVisible(button), 5000);
        await driver.wait(until.elementIsEnabled(button), 5000);

        console.log('Кнопка "Start reading" найдена!');

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