export function delay(ms: number) {
    console.log(`Пауза ${ms} ms`)
    return new Promise(resolve => setTimeout(resolve, ms));
}