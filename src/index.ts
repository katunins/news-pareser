import { Builder, Browser, By, until } from 'selenium-webdriver'

// Функция для ожидания готовности Selenium Hub
async function waitForSeleniumHub(statusUrl: string, maxAttempts = 30): Promise<void> {
    console.log('⏳ Ожидание готовности Selenium Hub...')
    console.log(`🔗 Проверяем URL: ${statusUrl}`)
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`📡 Попытка подключения ${attempt}/${maxAttempts}...`)
            const response = await fetch(statusUrl)
            console.log(`📊 Статус ответа: ${response.status} ${response.statusText}`)
            if (response.ok) {
                console.log('✅ Selenium Hub готов!')
                return
            }
        } catch (error) {
            console.log(`❌ Ошибка подключения: ${(error as Error).message}`)
        }
        console.log(`⏳ Попытка ${attempt}/${maxAttempts} - Selenium Hub еще не готов, ожидание 2 секунды...`)
        await new Promise(resolve => setTimeout(resolve, 2000))
    }
    throw new Error('Selenium Hub не готов после максимального количества попыток')
}

async function parseDivs() {
    // URL для WebDriver
    console.log('SELENIUM_HUB_URL', process.env.SELENIUM_HUB_URL)
    const seleniumHubUrl = process.env.SELENIUM_HUB_URL || 'http://localhost:4444/wd/hub'
    // URL для статуса Selenium Grid 4
    const seleniumStatusUrl = seleniumHubUrl.replace(/\/wd\/hub$/, '') + '/status'

    console.log('🚀 Запуск парсера...')
    console.log(`📡 Подключение к Selenium Hub: ${seleniumHubUrl}`)

    // Ждем готовности Selenium Hub
    await waitForSeleniumHub(seleniumStatusUrl)

    let driver: any = null

    try {
        // Создаем драйвер с подключением к Selenium Grid
        driver = await new Builder()
            .usingServer(seleniumHubUrl)
            .forBrowser(Browser.CHROME)
            .build()

        console.log('✅ Драйвер создан успешно')

        // Переходим на сайт
        console.log('🌐 Переход на сайт https://ikatunin.ru...')
        await driver.get('https://ikatunin.ru')

        // Ждем загрузки страницы
        await driver.wait(until.elementLocated(By.tagName('body')), 10000)
        console.log('✅ Страница загружена')

        // Ищем все div элементы
        console.log('🔍 Поиск всех div элементов...')
        const divElements = await driver.findElements(By.tagName('div'))

        console.log(`\n📊 Найдено div элементов: ${divElements.length}`)
        console.log('='.repeat(50))

        // Выводим информацию о каждом div
        for (let i = 0; i < divElements.length; i++) {
            try {
                const div = divElements[i]
                const tagName = await div.getTagName()
                const className = await div.getAttribute('class')
                const id = await div.getAttribute('id')
                const text = await div.getText()

                console.log(`\n🔹 Div #${i + 1}:`)
                console.log(`   Tag: ${tagName}`)
                console.log(`   Class: ${className || 'нет'}`)
                console.log(`   ID: ${id || 'нет'}`)
                console.log(`   Text: ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`)

                // Если есть вложенные элементы, показываем их количество
                const childElements = await div.findElements(By.xpath('.//*'))
                if (childElements.length > 0) {
                    console.log(`   Вложенных элементов: ${childElements.length}`)
                }

            } catch (error) {
                console.log(`❌ Ошибка при обработке div #${i + 1}:`, (error as Error).message)
            }
        }

        console.log('\n' + '='.repeat(50))
        console.log('✅ Парсинг завершен успешно!')

    } catch (error) {
        console.error('❌ Ошибка при выполнении парсинга:', error)
    } finally {
        if (driver) {
            console.log('🔚 Закрытие драйвера...')
            await driver.quit()
            console.log('✅ Драйвер закрыт')
        }
    }
}

// Запускаем парсинг
parseDivs().catch(console.error)