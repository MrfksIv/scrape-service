import { CompCondition, DataStoreOperations, DateRange } from './DataStore.interface';
import { Location, Profile, Sex } from '../entities';
import {getDateStringFromTimeStamp, removeTimeFromDateNumber} from '../utils'
import { getDistance } from 'geolib';


export class InMemoryDataStore implements DataStoreOperations {
    private static instance: InMemoryDataStore;
    private store: Profile[];

    private constructor() {
        this.store = [];
    }

    public static getInstance(): InMemoryDataStore {
        if (!this.instance) {
            this.instance = new InMemoryDataStore();
        }
        return this.instance;
    }

    public insertProfile(profile: Profile): void {
        this.store.push(profile);
    }

    public getLocationsByNamesAndDate(names: string[], date: number): Array<Location | null> {
        const locations: Array<Location | null> = [];

        const filteredProfiles = this.store.filter((profile) => names.includes(profile.name))
            .map((profile) => ({[profile.name]: profile}));

        const filteredProfilesObject = Object.assign({}, ...filteredProfiles);

        names.forEach((name) => {
            // if a matching profile is found add the location.
            if (filteredProfilesObject[name]) {
                Object.entries(filteredProfilesObject[name].locations).forEach(([datetime, location]) => {
                    const dateWithoutTime = removeTimeFromDateNumber(Number(datetime));

                    if (dateWithoutTime === date) {
                        locations.push(location as Location);
                    }
                });
            } else {
                // otherwise add a null (This is done in order to preserve the name order as given in the call parameters)
                locations.push(null);
            }
        });

        return locations;
    }

    public getProfilesByAgeAndSex(sex: Sex, age: number, ageCondition: CompCondition): Profile[] {
        let filteredProfiles = this.store.filter((profile) => profile.sex === sex);

        if (filteredProfiles.length > 0) {
            switch (ageCondition) {
                case CompCondition.EQ:
                    return filteredProfiles.filter((profile) => profile.age === age);
                case CompCondition.NE:
                    return filteredProfiles.filter((profile) => profile.age !== age);
                case CompCondition.LT:
                    return filteredProfiles.filter((profile) => profile.age < age);
                case CompCondition.LTE:
                    return filteredProfiles.filter((profile) => profile.age <= age);
                case CompCondition.GT:
                    return filteredProfiles.filter((profile) => profile.age > age);
                case CompCondition.GTE:
                    return filteredProfiles.filter((profile) => profile.age >= age);
                default:
                    return [];
            }
        }
        return [];
    }

    public clearStore() {
        this.store = [];
    }


    public getProfileByProximityAndDateRange(proximityInMetres: number, dateRange: DateRange): string[] {

        const results:  {name: string, lat: number, lon: number, dateWithNoTime: number}[] = [];
        const conclusions: string[] = [];

        // Filter the locations of each profile based on the dateRange
        for (const profile of this.store) {
            Object.entries(profile.locations).forEach( ([date, location]) => {
                const dateWithNoTime = removeTimeFromDateNumber(Number(date));

                if (dateWithNoTime >= dateRange.from && dateWithNoTime <= dateRange.to) {
                    // flatten results into a 1-D array
                    results.push({name: profile.name, ...location, dateWithNoTime})
                }
            })
        }

        // if only 1 location is found in the date range return since results are impossible
        if (results.length <= 1) {
            return conclusions;
        }

        // loop through results and compare every possible combination
        for (let i = 0; i < results.length - 1; i ++) {
            for (let j = i + 1; j < results.length; j ++) {
                if (results[i].name === results[j].name) {
                    // two locations from the same profile. skipping...
                    continue;
                }

                // first check if the date of the 2 locations is the same
                if (results[i].dateWithNoTime === results[j].dateWithNoTime){

                    // if the date matches, also check for the proximity between the locations
                    const loc1 = {lat: results[i].lat, lon: results[i].lon};
                    const loc2 = {lat: results[j].lat, lon: results[j].lon};
                    const distanceBetweenLocs = getDistance(loc1, loc2);

                    // if the distance is <= to the required proximity, add a formatted string to the results
                    if (distanceBetweenLocs <= proximityInMetres) {
                        const dateString = getDateStringFromTimeStamp(results[j].dateWithNoTime);
                        conclusions.push(`${results[i].name} and ${results[j].name} were close to each other on ${dateString}`);
                    }
                }
            }
        }
        return conclusions;
    }
}
