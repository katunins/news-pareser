import { inboxService } from "../services/inbox.service";
import { parse } from 'node-html-parser'

export async function getSubmitUrlFromEmail() {
    try {
        console.log(`🌐 Загрузка email ${inboxService.userName}@ ...`)
        const result = await inboxService.getInbox()
        const inbox = result?.data?.inbox || []
        if (inbox.length === 0) {
            throw new Error('Не найдено ни одного email')
        }
        const newest = inbox.reduce((latest, item) => {
            return new Date(item.date) > new Date(latest.date) ? item : latest;
        }, inbox[0]);
        const email = await inboxService.getDetailEmail(newest.id)
        const { subject, date, html } = email?.data?.message || {}
        if (!subject || !date || !html) {
            throw new Error('В Email нет данных')
        }
        const root = parse(html)
        const element = root.querySelector('a.email-link')
        const url = element?.getAttribute('href')
        if (!url) {
            throw new Error('Не удалось получить url из письма с подтверждением регистрации')
        }
        console.log('✅ Получен url для авторизации', url)
        const response = await inboxService.delete(newest.id)
        if (response.data.delete) {
            console.log('✅ Email удален')
        }
        return url
    } catch (error) {
        console.log('❌ Ошибка загрузки inbox', error)
    }
}