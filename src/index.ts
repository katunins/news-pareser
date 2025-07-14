import { seleniumService } from './services/selenium.service'
import { loadBodyStage } from './stages/load_body.stage'
import { clickElement, getElement, waitRender } from './utils/elements'
import { isAuthorized } from './stages/isAuthorized.stage'
import { SITE_URL, USER_EMAIL } from './consts'
import { cookiesStorage, htmlStorage, StorageService } from './services/storage.service'
import { delay } from './utils/general'
import { inboxService } from './services/inbox.service'
import { snapShotHTML } from './utils/html'
import { By, until } from 'selenium-webdriver'
import { inputEmail } from './stages/input_email.stage'
import { getSubmitUrlFromEmail } from './utils/inbox'
import { getAccessToken } from './utils/parser'
import { authRequest } from './stages/authRequest'
import { convertCoockieToMap } from './utils/cookies'

async function parseDivs() {
    await seleniumService.init()
    if (!seleniumService.driver) {
        console.log('❌ Ошибка инициализации сервиса')
        return
    }
    try {
        await loadBodyStage()
        const isAuth = await isAuthorized()

        if (!isAuth) {
            await clickElement('Sign in', 'a')
            await waitRender(By.css('div[role="dialog"]'))
            await delay(1000)
            await clickElement('Sign in with email', 'button')
            await waitRender(By.css('input[type="email"]'))
            await inputEmail()
            await clickElement('Continue', 'button')
            await waitRender(By.css("img[alt='Envelope icon']"))
            await seleniumService.driver?.navigate().refresh()
            await delay(10000)
            snapShotHTML()
            const url = await getSubmitUrlFromEmail()
            if (!url) {
                throw new Error('Не удалось получить URL для авторизации')
            }

            const token = getAccessToken(url)
            if (!token) {
                throw new Error('Не удалось получить токен из URL')
            }
            // const rawCookies = await authRequest(token)
            const json = await authRequest(token)
            const cookies = [
                {
                    name: 'uid',
                    value: json.payload.value.uid
                },
                {
                    name: 'xsrf',
                    value: json.payload.value.xsrf
                },
                {
                    name: 'sid',
                    value: json.payload.value.sessionToken
                },
            ]

            // await loadBodyStage()
            await seleniumService.driver?.navigate().refresh()
            // await delay(5000)
            // await snapShotHTML()
            // const cookies = rawCookies.map(cookie => convertCoockieToMap(cookie))
            // await seleniumService.driver?.manage().deleteAllCookies()
            await cookiesStorage.save(cookies)
            await seleniumService.setCookies(cookies)

            console.log(`🌐 Переход по ссылке ${json.payload.value.redirect}...`)
            await seleniumService.driver?.get(json.payload.value.redirect)
            // await delay(1000)
            await snapShotHTML()
            await waitRender(By.css("button[data-testid='headerUserIcon']"))
            await snapShotHTML()
            console.log('✅ Пользователь авторизован!')
            // await snapShotHTML()
            // await seleniumService.saveCookies()
        }


        console.log('\n' + '='.repeat(50))
        console.log('✅ Парсинг завершен успешно!')

    } catch (error) {
        snapShotHTML()
        console.log('\n' + '='.repeat(50))
        console.error('❌ Ошибка при выполнении парсинга:', error)
    } finally {
        seleniumService.driver.quit()
    }
}

parseDivs().catch(console.error)