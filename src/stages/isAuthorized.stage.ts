import { By } from "selenium-webdriver"
import { seleniumService } from "../services/selenium.service"
import { snapShotHTML } from "../utils/html"

export async function isAuthorized() {
    console.log(`🌐 Проверка авторизации...`)
    await snapShotHTML('check_auth')
    const elements = await seleniumService.driver?.findElements(By.xpath(`//a[text()='Sign in']`))
    const isAuthorized = elements?.length === 0
    console.log(`Пользователь ${isAuthorized ? 'авторизован' : 'не авторизован'}`)
    return isAuthorized
}