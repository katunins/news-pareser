import { By, until, WebElement } from "selenium-webdriver"
import { seleniumService } from "../services/selenium.service"

export async function clickElement(buttonText: string, tag: 'a' | 'button') {
    console.log(`🌐 Поиск <${tag}> ${buttonText}...`)
    const elements = await seleniumService.driver?.findElements(By.css(tag)) || []
    let element: WebElement | undefined
    for (let i = 0; i < elements.length; i++) {
        const textContent = await elements[i].getText()
        if (textContent.trim() === buttonText) {
            element = elements[i]
        }
    }
    if (element) {
        await element.click()
        console.log(`✅ элемент <${tag}> нажат`)
    } else {
        throw new Error('❌ Элемент не найден')
    }
}

export function getElement(by: By) {
    return seleniumService.driver?.findElement(by)
}

export async function waitRender(by: By, delay = 10000) {
    return seleniumService.driver?.wait(until.elementLocated(by), delay)
}