import { NextFunction, Request, Response } from 'express';
import * as winston from 'winston';

import {
    getBoundingBoxFromLocations,
    getGMapsInfoFromLocation,
    validateAgeSexQuery,
    validateNameDateQuery,
    validateProximityDaterangeQuery
} from '../helpers';
import { InMemoryDataStore } from '../data-store';
import { getTimestampFromDateString, removeTimeFromDateNumber } from '../utils';
import { DateRange } from '../data-store/DataStore.interface';
import { ErrorType, ServiceError } from '../entities';

export class QueryController {

    private static instance: QueryController;
    private dataStore: InMemoryDataStore;

    private constructor() {
        this.dataStore = InMemoryDataStore.getInstance();
    }

    public static getInstance(): QueryController {
        if (!this.instance) {
            this.instance = new QueryController();
        }
        return this.instance;
    }

    @errorCatcher
    public async queryByNamesAndDate(req: Request, res: Response, next: NextFunction) {
        validateNameDateQuery(req);
        let { names, date } = req.body;

        names = JSON.parse(names);
        const timestamp = getTimestampFromDateString(date);
        const dateWithoutTime = removeTimeFromDateNumber(timestamp);

        const locationsResult = this.dataStore.getLocationsByNamesAndDate(names, dateWithoutTime);
        const resultAsArray = locationsResult.map((obj) => obj !== null ? [obj.lat, obj.lon] : null);

        const locationNames: string[] = [];

        for (const location of locationsResult) {
            if (location !== null) {
                const gMapsInfo = await getGMapsInfoFromLocation(location);
                locationNames.push(gMapsInfo?.plus_code?.compound_code ?? null);
            } else {
                locationNames.push(null);
            }
        }

        type resultType = {locations: number[][], places: string[], bbox?: number[]};
        const resultR: resultType  = {locations: resultAsArray, places: locationNames};

        const nonNullLocations = locationsResult.filter((location) => location !== null);
        if (nonNullLocations.length >= 2) {
            const bbox = getBoundingBoxFromLocations(nonNullLocations);
            if (bbox !== null) {
                resultR.bbox = bbox;
            }
        }

        return resultR;
    }

    @errorCatcher
    public queryByAgeAndSex(req: Request, res: Response, next: NextFunction) {
        validateAgeSexQuery(req);

        const { sex, age, condition } = req.body;

        return this.dataStore.getProfilesByAgeAndSex(sex, age, condition);
    }

    @errorCatcher
    public queryByProximityAndDateRange(req: Request, res: Response, next: NextFunction) {
        validateProximityDaterangeQuery(req);

        let { proximity, daterange } = req.body;
        daterange = JSON.parse(daterange);
        const dateRangeNumber: DateRange = {
            from: getTimestampFromDateString(daterange.from),
            to: getTimestampFromDateString(daterange.to)
        };
        if (dateRangeNumber.from > dateRangeNumber.to) {
            throw new ServiceError('From date must be smaller than to', ErrorType.VALIDATION)
        }
        return this.dataStore.getProfileByProximityAndDateRange(proximity, dateRangeNumber);
    }
}

function errorCatcher(target: QueryController, propertyKey: string, propertyDescriptor: PropertyDescriptor) {

    // get the original method
    const originalMethod = propertyDescriptor.value;

    propertyDescriptor.value = async function(req: Request, res: Response, next: NextFunction) {
        try {
            return await originalMethod.apply(this, [req, res, next]);
        } catch (e) {
            winston.error(propertyKey, e);
            next(e);
        }
    }
}
