import {ValidationErrorItem} from '@hapi/joi';

type Json = {[key: string]: number | string | null | undefined | Json | Date};

export enum ErrorType {
    SERVER = 'SERVER.ERROR',
    VALIDATION = 'VALIDATION.ERROR',
    NOT_FOUND = '404_ROUTE_NOT_FOUND',
}

export class ServiceError extends Error {

    errorType: ErrorType;
    errorFields: string[] | ValidationErrorItem[];

    constructor(message: string, type: ErrorType, field?: string[] | ValidationErrorItem[]) {
        super(message);
        this.errorType = type;
        if (field) {
            this.errorFields = field;
        }
    }
}

export interface IJoiError {
    isJoi: boolean;
    name: string;
    details: IErrorDetails[];
    _object: IObject;
}

interface IErrorDetails {
    message: string;
    path: string[];
    type: string;
    context: IErrorContext;
}

interface IErrorContext {
    key: string;
    label: string;
}

interface IObject {[key: string]: string; }
