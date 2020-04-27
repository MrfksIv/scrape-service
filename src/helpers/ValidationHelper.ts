import {array, number, object as JoiObject, object, Schema, string, valid} from '@hapi/joi';
import {Request} from 'express';

import {ErrorType, ServiceError, Sex} from '../entities';
import {CompCondition as Cond} from '../data-store';

export function validateAgeSexQuery(req: Request) {
    const schema: Schema = JoiObject({
        age: number().required(),
        sex: valid(Sex.FEMALE, Sex.MALE).required(),
        condition: valid(Cond.EQ, Cond.NE, Cond.GT,  Cond.GTE, Cond.LT, Cond.LTE)
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        throw new ServiceError(error.message, ErrorType.VALIDATION, error.details);
    }
}

export function validateNameDateQuery(req: Request) {
    let {names, date} = req.body;
    try {
        names = JSON.parse(names);
    } catch(e) {
        throw new ServiceError('Invalid Array: Failed to parse', ErrorType.VALIDATION);
    }
    const schema: Schema = JoiObject({
        names: array().required().items(string()),
        date: string().required().regex(/^\d{2}[-|/|\.]\d{2}[-|/|\.]\d{4}$/)
    });

    const { error } = schema.validate({names, date}, { abortEarly: false });
    if (error) {
        throw new ServiceError(error.message, ErrorType.VALIDATION, error.details);
    }
}

export function validateProximityDaterangeQuery(req: Request) {
    let {daterange, proximity} = req.body;
    try {
        daterange = JSON.parse(daterange);
    } catch(e) {
        throw new ServiceError('Invalid Object: Failed to parse', ErrorType.VALIDATION);
    }
    const schema: Schema = JoiObject({
        proximity: number().required().min(0),
        daterange: object().keys({
            from: string().required().regex(/^\d{2}[-|/|\.]\d{2}[-|/|\.]\d{4}$/),
            to: string().required().regex(/^\d{2}[-|/|\.]\d{2}[-|/|\.]\d{4}$/)
        }).required()
    });

    const { error } = schema.validate({daterange, proximity}, { abortEarly: false });
    if (error) {
        throw new ServiceError(error.message, ErrorType.VALIDATION, error.details);
    }
}
