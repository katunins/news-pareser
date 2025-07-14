import { By } from "selenium-webdriver"
import { seleniumService } from "../services/selenium.service"
import { USER_EMAIL } from "../consts"
import { getElement } from "../utils/elements"

export async function inputEmail() {
    console.log(`🌐 Ввод email...`)
    const element = await getElement(By.css("input[placeholder='Enter your email address']"))
    if (element) {
        await element.sendKeys(USER_EMAIL)
        console.log('✅ email введен')
    } else {
        throw new Error('❌ Элемент не найден')
    }
}