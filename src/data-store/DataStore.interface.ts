import {Location, Profile, Sex} from '../entities';

export enum CompCondition {
    GT = 'GT',
    GTE = 'GTE',
    LT = 'LT',
    LTE = 'LTE',
    EQ = 'EQ',
    NE = 'NE',
}

export interface DateRange {
    from: number;
    to: number;
}


export interface DataStoreOperations {
    getProfilesByAgeAndSex(sex: Sex, age: number, ageCondition: CompCondition): Profile[];
    getLocationsByNamesAndDate(names: string[], date: number): Array<Location | null>;
    getProfileByProximityAndDateRange(proximityInMetres: number, dateRange: DateRange): string[];
    insertProfile(profile: Profile): void;
}
