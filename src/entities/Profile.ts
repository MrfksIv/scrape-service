import { Location } from './Location';

export enum Sex {
    MALE='male',
    FEMALE='female'
}

export interface NameAgeSexProfInfo {
    name: string;
    age: number;
    sex: Sex;
    profession: string;
}
export interface Profile extends NameAgeSexProfInfo {
    locations: {
        [date: number]: Location
    }
}
