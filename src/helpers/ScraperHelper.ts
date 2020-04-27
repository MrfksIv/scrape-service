import * as cheerio from 'cheerio';
import {default as axios} from "axios";
import * as winston from "winston";

let $: CheerioStatic | null = null;


export async function loadWebsite(url: string): Promise<string | null> {
    try {
        const result = await axios.get(url);
        return result.data;
    } catch (e) {
        winston.error('ScraperHelper.loadWebsite: ', e);
        return null;
    }
}

export function loadHTML(html: string) {
    $ = cheerio.load(html);
    return $;
}


