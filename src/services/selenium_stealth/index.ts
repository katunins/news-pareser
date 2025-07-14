import { WebDriver } from 'selenium-webdriver';

type StealthOptions = {
    userAgent?: string;
    languages?: string[];
    vendor?: string;
    platform?: string | null;
    webglVendor?: string;
    renderer?: string;
    fixHairline?: boolean;
    runOnInsecureOrigins?: boolean;
};

const DEFAULT_OPTIONS: Required<Omit<StealthOptions, 'userAgent' | 'platform'>> & { driver: WebDriver | null, platform: string | null } = {
    driver: null,
    languages: ["en-US", "en"],
    vendor: "Google Inc.",
    platform: null,
    webglVendor: "Intel Inc.",
    renderer: "Intel Iris OpenGL Engine",
    fixHairline: false,
    runOnInsecureOrigins: false
};

// Импортируйте ваши evasions как модули
const chromeApp = require("./evasions/chrome.app");
const chromeRuntime = require("./evasions/chrome.runtime");
const hairlineFix = require("./evasions/hairline.fix");
const iframeContentWindow = require("./evasions/iframe.contentWindow");
const mediaCodecs = require("./evasions/media.codecs");
const navigatorLanguages = require("./evasions/navigator.languages");
const navigatorPermissions = require("./evasions/navigator.permissions");
const navigatorPlugins = require("./evasions/navigator.plugins");
const navigatorVendor = require("./evasions/navigator.vendor");
const navigatorWebdriver = require("./evasions/navigator.webdriver");
const utils = require("./evasions/utils");
const webglVendorOverride = require("./evasions/webgl.vendor");
const windowOuterDimensions = require("./evasions/window.outerdimensions");

export class SeleniumStealth {
    driver: WebDriver;
    cdpConnection: any;

    constructor(driver: WebDriver) {
        if (!driver || typeof driver.createCDPConnection !== 'function') {
            throw new Error("Driver must be a valid selenium WebDriver with createCDPConnection");
        }
        this.driver = driver;
        this.cdpConnection = driver.createCDPConnection('page');
    }

    async stealth(options: StealthOptions = {}) {
        const _options = { ...DEFAULT_OPTIONS, ...options };
        const {
            userAgent,
            languages,
            vendor,
            platform,
            webglVendor,
            renderer,
            fixHairline,
            runOnInsecureOrigins,
        } = _options;
        const uaLanguages = languages.join(',');

        this.cdpConnection = await this.cdpConnection;
        await this.executeCDPCommand('Runtime.enable');
        await this.executeCDPCommand('Page.enable');
        await this.addScriptToEvaluateOnNewDocument(utils);
        await this.addScriptToEvaluateOnNewDocument(chromeApp);
        await this.addScriptToEvaluateOnNewDocument(chromeRuntime, { runOnInsecureOrigins });
        await this.addScriptToEvaluateOnNewDocument(iframeContentWindow);
        await this.addScriptToEvaluateOnNewDocument(mediaCodecs);
        await this.addScriptToEvaluateOnNewDocument(navigatorLanguages, { languages });
        await this.addScriptToEvaluateOnNewDocument(navigatorPermissions);
        await this.addScriptToEvaluateOnNewDocument(navigatorPlugins);
        await this.addScriptToEvaluateOnNewDocument(navigatorVendor, { vendor });
        await this.addScriptToEvaluateOnNewDocument(navigatorWebdriver);
        await this.userAgentOverride(userAgent, uaLanguages, platform);
        await this.addScriptToEvaluateOnNewDocument(webglVendorOverride, { webglVendor, renderer });
        await this.addScriptToEvaluateOnNewDocument(windowOuterDimensions);
        if (fixHairline) {
            await this.addScriptToEvaluateOnNewDocument(hairlineFix);
        }
    }

    getRandId(): number {
        return Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    }

    async addScriptToEvaluateOnNewDocument(func: Function, args: Record<string, any> = {}) {
        const _args = Object.values(args).map(arg => {
            if (typeof arg === 'string') return `"${arg}"`;
            else if (Array.isArray(arg)) return JSON.stringify(arg);
            else return arg;
        }).join(',');
        await this.driver.executeScript(`(${func.toString()})(${_args})`);
        await this.executeCDPCommand("Page.addScriptToEvaluateOnNewDocument", { source: `(${func.toString()})(${_args})`, func });
    }

    async userAgentOverride(userAgent?: string, language?: string, platform?: string | null) {
        let ua: string;
        if (!userAgent)
            ua = await this.getUserAgent();
        else
            ua = userAgent;
        ua = ua.replace("HeadlessChrome", "Chrome"); // hide headless nature
        let override: Record<string, any> = {};
        if (language && platform)
            override = { "userAgent": ua, "acceptLanguage": language, "platform": platform };
        else if (!language && platform)
            override = { "userAgent": ua, "platform": platform };
        else if (language && !platform)
            override = { "userAgent": ua, "acceptLanguage": language };
        else
            override = { "userAgent": ua };
        await this.executeCDPCommand("Network.setUserAgentOverride", override);
    }

    async getUserAgent(): Promise<string> {
        const result = await this.executeCDPCommand("Browser.getVersion", {});
        return result.userAgent;
    }

    executeCDPCommand(method: string, params: Record<string, any> = {}): Promise<any> {
        return new Promise(async resolve => {
            const randId = this.getRandId();
            const messageHandler = (message: string) => {
                const { id, result, method: msgMethod, error } = JSON.parse(message);
                if (error) {
                    throw new Error(`An error occurred when executing cdp command from ${msgMethod} \n ${error}`);
                }
                const runtimeContextCreated = msgMethod === 'Runtime.executionContextCreated';
                if (!id) {
                    return this.cdpConnection._wsConnection.once('message', messageHandler);
                }
                if ((id === randId) || runtimeContextCreated) {
                    resolve(result);
                }
            };
            this.cdpConnection._wsConnection.once('message', messageHandler);
            this.cdpConnection.execute(
                method,
                randId,
                params,
                null
            );
        });
    }
}

export default SeleniumStealth