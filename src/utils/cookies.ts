import { IWebDriverOptionsCookie } from "selenium-webdriver";

export const convertCoockieToMap = (cookie: string): IWebDriverOptionsCookie => {
    const parts = cookie.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, ...valueParts] = nameValue.split('=');
    const value = valueParts.join('=');

    const cookieObj: IWebDriverOptionsCookie = {
        name,
        value,
    };

    attributes.forEach(attr => {
        const [attrKey, ...attrValueParts] = attr.split('=');
        const attrValue = attrValueParts.join('=');
        switch (attrKey.toLowerCase()) {
            case 'path':
                cookieObj.path = attrValue;
                break;
            case 'domain':
                cookieObj.domain = attrValue;
                break;
            case 'secure':
                cookieObj.secure = true;
                break;
            case 'httponly':
                cookieObj.httpOnly = true;
                break;
            case 'expires':
                // Try to parse date string to Date
                const date = new Date(attrValue);
                if (!isNaN(date.getTime())) {
                    cookieObj.expiry = Math.floor(date.getTime() / 1000);
                }
                break;
            case 'samesite':
                cookieObj.sameSite = attrValue;
                break;
            default:
                // ignore unknown attributes
                break;
        }
    });

    return cookieObj;
};