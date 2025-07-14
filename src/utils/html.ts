import { seleniumService } from "../services/selenium.service"
import { promises as fs } from 'fs';
import path from 'path'

export async function snapShotHTML() {
    const html = await seleniumService.driver?.getPageSource()
    if (html) {
        console.log('Делаем snapshot')
        const timestamp = Date.now();
        const filename = `./snapshots/${timestamp}.html`;
        const dir = path.dirname(filename);
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(filename, html, 'utf-8')
    }
}