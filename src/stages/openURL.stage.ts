import { By, until } from "selenium-webdriver"
import { SITE_URL } from "../consts"
import { seleniumService } from "../services/selenium.service"

export async function openURL(url: string) {
    console.log(`🌐 Открываем страницу ${SITE_URL}...`)
    await seleniumService.driver?.get(SITE_URL)
    console.log(`🌐 Ожидаем рендер ...`)
    await seleniumService.driver?.wait(until.elementLocated(By.css('body')), 10000)
    console.log('✅ Страница загружена')
}