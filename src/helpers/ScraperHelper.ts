import * as cheerio from 'cheerio';

let $: CheerioStatic | null = null;

export function loadHTML(html: string) {
    $ = cheerio.load(html);
    return $;
}


