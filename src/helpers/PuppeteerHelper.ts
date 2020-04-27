import * as puppeteer from 'puppeteer';
import * as winston from 'winston';
import {Browser, Page} from 'puppeteer';

let browser: Browser | null = null;
let newPage: Page | null = null;

export async function parseWebsite(url: string): Promise<string | null> {
    try {
        await init();
        await newPage.goto(url);
        return await newPage.content();
    } catch (e) {
        winston.error('PuppeteerHelper.parseWebsite: ', e);
        return null;
    }
}

export async function close() {
    if (browser) {
        await browser.close();
    }
}

async function init() {
    if (browser === null) {
        browser = await puppeteer.launch();
    }
    if (newPage === null) {
        newPage = await browser.newPage();
    }
}
