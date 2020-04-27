import { parseWebsite, loadHTML } from '../helpers';
import { NameAgeSexProfInfo, Location, Profile } from '../entities';
import { getTimestampFromDatetimeString } from '../utils';

const CHECKIN_HISTORY_PLACEHOLDER = 'Check-in history:';

export async function parseProfilesFromWebsite(): Promise<Profile[]> {
    const content = await parseWebsite(process.env.SCRAPE_SITE_URL);

    const html = loadHTML(content);
    const textareaContent = html('#paste_code').html();
    const unparsedProfileArray = textareaContent.split('\n\n');

    const profiles = unparsedProfileArray.map((unparsedProfile) => {

        const nameAgeSexProfessionObj = parseNameAgeSexProfInfo(unparsedProfile);
        const locationsObj = parseLocationInfo(unparsedProfile);

        const profile: Profile = {...nameAgeSexProfessionObj, locations: locationsObj};
        return profile;
    });

    return profiles;
}

function parseLocationInfo(unparsedProfile: string): Location[] {
    const checkinHistory = unparsedProfile.substring(unparsedProfile.indexOf(CHECKIN_HISTORY_PLACEHOLDER)+ CHECKIN_HISTORY_PLACEHOLDER.length + 1, unparsedProfile.length).trim();
    const locationObjArray = checkinHistory
        .split('\n')
        .map((elem) => {
            const [key, val] = elem.trim().split(' - ');
            const dateKey = getTimestampFromDatetimeString(key.trim());

            const [lat, lon] = val.split(', ').map((coordinate) => Number(coordinate))
            return { [dateKey]: { lon, lat } }
        });
    return Object.assign({}, ...locationObjArray);
}

function parseNameAgeSexProfInfo(unparsedProfile: string): NameAgeSexProfInfo {

    const nameAgeSexProfessionInfo = unparsedProfile.substring(0, unparsedProfile.indexOf(CHECKIN_HISTORY_PLACEHOLDER));

    const arrOfObj = nameAgeSexProfessionInfo
        .split('\n')
        .filter(elem=> elem.length > 0)
        .map(elem=> {
            const [key, val] = elem.split(': ');
            return {[key.trim()]: val.trim()}
        });

        return Object.assign({}, ...arrOfObj);
}
