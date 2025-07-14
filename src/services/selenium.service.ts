import { SELENIUM_HUB_URL, SITE_URL } from "../consts"
import { Builder, Browser, By, until, ThenableWebDriver, WebDriver, IWebDriverOptionsCookie } from 'selenium-webdriver'
import { cookiesStorage } from "./storage.service"
import { openURL } from "../stages/openURL.stage"
import SeleniumStealth from '../services/selenium_stealth/index'

class SeleniumService {

    driver?: WebDriver

    async init() {
        this.driver = await this.getDriver()
        await this.removeWebDriverProperties()
        await openURL(SITE_URL)
        await this.loadCookies()
        await this.driver?.navigate().refresh();
    }

    async reStartriver() {
        this.driver?.quit()
        this.driver = await this.getDriver()
        await this.removeWebDriverProperties()
    }

    async setCookies(cookies: IWebDriverOptionsCookie[]) {
        console.log(`🌐 Устанавливаем cookies...`)
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i]
            await seleniumService.driver?.manage().addCookie(cookie)
        }
    }

    async loadCookies() {
        // await this.driver?.manage().deleteAllCookies()
        const cookies = await cookiesStorage.load()
        if (cookies) {
            console.log('✅ Cookies загружены')
            await this.setCookies(cookies)
        } else {
            console.log('❌ Не удалось загрузить Cookies')
        }
    }

    async saveDriverCookies() {
        const cookies = await this.driver?.manage().getCookies()
        if (cookies) {
            await cookiesStorage.save(cookies)
            console.log('✅ Cookies из driver сохранены')
        } else {
            console.log('❌ Не удалось загрузить Cookies из dliver')
        }
    }

    async close() {
        await this.driver?.quit()
        console.log('✅ Драйвер закрыт')
    }

    private async getDriver(): Promise<ThenableWebDriver | undefined> {
        console.log(`🚀 Подключение к Selenium Hub: ${SELENIUM_HUB_URL}`)

        // Настройки Chrome для обхода Cloudflare
        const chrome = require('selenium-webdriver/chrome');
        const options = new chrome.Options();

        // User-Agent обычного браузера
        const userAgents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ];
        const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

        options.addArguments('--headless=new'); // Новый headless-режим
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--disable-gpu');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--user-data-dir=/tmp/selenium-profile');
        options.addArguments('--disable-blink-features=AutomationControlled');
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-features=VizDisplayCompositor');
        options.addArguments(`--user-agent=${randomUA}`);

        // Отключение флагов автоматизации
        // options.addArguments('--disable-blink-features=AutomationControlled');

        // Дополнительные настройки для маскировки
        // options.addArguments('--no-sandbox');
        // options.addArguments('--disable-dev-shm-usage');
        // options.addArguments('--disable-gpu');
        // options.addArguments('--window-size=1920,1080');

        // Отключение изображений для ускорения (опционально)
        // options.addArguments('--blink-settings=imagesEnabled=false');

        // Дополнительные рекомендации для обхода Cloudflare:
        // options.addArguments('--proxy-server=http://your-proxy:port'); // Раскомментируйте если у вас есть прокси

        // Установка экспериментальных флагов
        options.setUserPreferences({
            'excludeSwitches': ['enable-automation'],
            'useAutomationExtension': false
        });

        // Headful и user-data-dir
        // НЕ добавляйте --headless
        // options.addArguments('--user-data-dir=/tmp/selenium-profile');
        // options.addArguments('--no-sandbox');
        // options.addArguments('--disable-gpu');
        // options.addArguments('--window-size=1920,1080');

        const driver = await new Builder()
            .usingServer(SELENIUM_HUB_URL)
            .forBrowser(Browser.CHROME)
            .setChromeOptions(options)
            .build();

        // const stealth = new SeleniumStealth(driver);
        // await stealth.stealth({
        //     userAgent: randomUA,
        //     languages: ['en-US', 'en'],
        //     // ...другие опции
        // });

        return driver;
    }

    // Удаление свойств webdriver для обхода Cloudflare
    private async removeWebDriverProperties() {
        // Если selenium-stealth всё делает, этот метод можно удалить или оставить пустым.
        // Если что-то не покрывается — оставьте только это.
    }
}

export const seleniumService = new SeleniumService()