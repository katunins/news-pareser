import { seleniumService } from "../services/selenium.service"
import { promises as fs } from 'fs';
import path from 'path'

export async function snapShotHTML(name: string) {
    console.log(`🌇 Делаем snapshot "${name}"... `)
    console.log('current URL', await seleniumService.driver?.getCurrentUrl())
    const html = await seleniumService.driver?.getPageSource()
    if (html) {
        const timestamp = Date.now();
        const filename = `./snapshots/${timestamp}_${name}.html`;
        const dir = path.dirname(filename);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filename, html, 'utf-8')
    }
}