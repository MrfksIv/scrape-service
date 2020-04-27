import { parseProfilesFromWebsite, saveProfilesToStore } from './src/controllers'
import * as dotenv from 'dotenv';
import * as winston from 'winston';
import { ExpressApp } from './src/api/app';
import { sleep } from './src/utils';

dotenv.config();


if (!process.env.SERVICE_RUN_INTERVAL || isNaN(Number(process.env.SERVICE_RUN_INTERVAL))) {
    throw new Error('Missing or invalid property from .env file: SERVICE_RUN_INTERVAL');
}

const app = ExpressApp.getInstance();
app.start();

(async () => {
    while (true) {
        winston.info('Parsing data from website...');
        const profiles = await parseProfilesFromWebsite();
        saveProfilesToStore(profiles);
        winston.info('Parsing finished...');

        await sleep(Number(process.env.SERVICE_RUN_INTERVAL));

    }
})();




