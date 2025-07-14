import { promises as fs } from 'fs';
import { IWebDriverOptionsCookie } from 'selenium-webdriver';


export class StorageService<T> {
    private filePath: string;

    constructor(filePath: string) {
        this.filePath = filePath;
    }

    async save(data: T): Promise<void> {
        const json = JSON.stringify(data, null, 2);
        await fs.writeFile(this.filePath, json, 'utf-8');
    }

    async saveRaw(data: string): Promise<void> {
        await fs.writeFile(this.filePath, data, 'utf-8');
    }

    async load(): Promise<T | null> {
        try {
            const content = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(content) as T;
        } catch (err: any) {
            if (err.code === 'ENOENT') {
                return null; // файл не найден — возвращаем null
            }
            throw err;
        }
    }
}

export const cookiesStorage = new StorageService<IWebDriverOptionsCookie[]>('cookies.json')
export const htmlStorage = new StorageService<string>('tmp.html')
