type TResponse = {
    success: boolean;
    payload: {
        value: {
            uid: string;
            sessionToken: string;
            redirect: string;
            xsrf: string;
            passwordPrompt: boolean;
        };
    };
    v: number;
    b: string;
}

export async function authRequest(accessToken: string): Promise<TResponse> {
    try {
        console.log(`🌐 Запрос авторизации с токеном ${accessToken}...`)
        const myHeaders = new Headers();
        myHeaders.append("accept", "application/json");
        myHeaders.append("content-type", "application/json");

        const raw = JSON.stringify({
            "source": "medium",
            accessToken,
            "operation": "login"
        });

        const response = await fetch("https://medium.com/m/signin", {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        })
        const text = await response.text()
        const jsonStr = text.substring(text.indexOf('{'));
        // const data = JSON.parse(jsonStr);
        return JSON.parse(jsonStr)
        // console.log(data)
        // return response.headers.getSetCookie()
    } catch (error) {
        console.log(error)
        throw new Error('❌ Запрос авторизации завершился с ошибкой')
    }
}