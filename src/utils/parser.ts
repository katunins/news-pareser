export const getAccessToken = (url: string) => {
    try {
        const urlObj = new URL(url);
        const token = urlObj.searchParams.get('token');
        return token;
    } catch (error) {
        console.log('❌ Ошибка при парсинге URL:', error instanceof Error ? error.message : String(error));
        return null;
    }
}