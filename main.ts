import { parseProfilesFromWebsite, saveProfilesToStore } from './src/controllers'
import * as dotenv from 'dotenv';

import { runScheduledTask } from './src/utils';
import { ExpressApp } from './src/api/app';

dotenv.config();

runScheduledTask( async () => {
    const profiles = await parseProfilesFromWebsite();
    saveProfilesToStore(profiles);
});

const app = ExpressApp.getInstance();
app.start();

