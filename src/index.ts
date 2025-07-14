import { seleniumService } from './services/selenium.service'
import { clickElement, getElement, waitRender } from './utils/elements'
import { isAuthorized } from './stages/isAuthorized.stage'
import { SITE_URL, USER_EMAIL } from './consts'
import { cookiesStorage, htmlStorage, StorageService } from './services/storage.service'
import { delay, randomDelay } from './utils/general'
import { inboxService } from './services/inbox.service'
import { snapShotHTML } from './utils/html'
import { By, until } from 'selenium-webdriver'
import { inputEmail } from './stages/input_email.stage'
import { getEmailCode, getSubmitUrlFromEmail } from './utils/inbox'
import { getAccessToken } from './utils/parser'
import { authRequest } from './stages/authRequest'
import { convertCoockieToMap } from './utils/cookies'
import { openURL } from './stages/openURL.stage'

async function parseDivs() {
    await seleniumService.init()
    if (!seleniumService.driver) {
        console.log('❌ Ошибка инициализации сервиса')
        return
    }
    try {
        const isAuth = await isAuthorized()

        if (!isAuth) {
            await clickElement('Sign in', 'a')
            await waitRender(By.css('div[role="dialog"]'))
            await randomDelay()
            await clickElement('Sign in with email', 'button')
            await waitRender(By.css('input[type="email"]'))
            await randomDelay()
            await inputEmail()
            await randomDelay()
            await snapShotHTML('enter_email')
            await clickElement('Continue', 'button')
            // await waitRender(By.css("img[alt='Envelope icon']"))
            await waitRender(By.xpath("//span[normalize-space(text())='Click here to verify with a code instead.']"))
            await randomDelay()
            await clickElement('Click here to verify with a code instead.', 'span')
            await delay(10000)
            const code = await getEmailCode()
            await snapShotHTML('get_email_code')
            if (!code) {
                throw new Error('Не удалось получить submit code для авторизации')
            }
            const input = await getElement(By.css("input[type='number']"))
            if (!code) {
                throw new Error('Не удалось получить input для ввода submit code')
            }
            await input?.sendKeys(code)
            await clickElement('OK', 'button')
            randomDelay()
            // const token = getAccessToken(url)
            // if (!token) {
            //     throw new Error('Не удалось получить токен из URL')
            // }
            // // const rawCookies = await authRequest(token)
            // const json = await authRequest(token)
            // const cookies = [
            //     {
            //         name: 'uid',
            //         value: json.payload.value.uid
            //     },
            //     {
            //         name: 'xsrf',
            //         value: json.payload.value.xsrf
            //     },
            //     {
            //         name: 'sid',
            //         value: json.payload.value.sessionToken
            //     },
            // ]
            // await loadBodyStage()
            // await seleniumService.driver?.navigate().refresh()
            // await delay(5000)
            // await snapShotHTML()
            // const cookies = rawCookies.map(cookie => convertCoockieToMap(cookie))
            // await seleniumService.driver?.manage().deleteAllCookies()
            // await cookiesStorage.save(cookies)
            await waitRender(By.css("button[data-testid='headerUserIcon']"))
            console.log(`✅ Запрос авторизации прошел успешно`)
            await seleniumService.saveDriverCookies()

            // console.log(`🌐 Переход по ссылке ${json.payload.value.redirect}...`)
            // await openURL(json.payload.value.redirect)
            // await delay(1000)
            await snapShotHTML('redirect_afrer_auth')
            // await waitRender(By.css("button[data-testid='headerUserIcon']"))
            console.log('✅ Пользователь авторизован!')
            // await snapShotHTML()
            // await seleniumService.saveCookies()
        }


        console.log('\n' + '='.repeat(50))
        console.log('✅ Парсинг завершен успешно!')

    } catch (error) {
        snapShotHTML('general_error')
        console.log('\n' + '='.repeat(50))
        console.error('❌ Ошибка при выполнении парсинга:', error)
    } finally {
        seleniumService.driver.quit()
    }
}

parseDivs().catch(console.error)