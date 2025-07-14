export function delay(ms: number) {
    console.log(`Пауза ${ms} ms`)
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function randomDelay(min = 300, max = 800) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min
    console.log(`Пауза ${ms} ms ...`)
    return new Promise(resolve => setTimeout(resolve, ms));
}