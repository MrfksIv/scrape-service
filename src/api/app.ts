import * as express from 'express';
import {Application, NextFunction, Request, Response} from 'express';
import * as bodyParser from 'body-parser';
import * as winston from 'winston';

import queryRouter from './routes/query';
import { ErrorType, ServiceError } from '../entities';
import { setupLoggers } from '../helpers';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../../swagger.json');

export class ExpressApp {

    private static instance: ExpressApp;
    private readonly app: Application;

    private constructor () {
        this.app = express();
        this.setupLogging();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.setupRoutes();
        this.setupDocs();
        this.setupMissingEndpointHandling();
        this.setupErrorHandling();
    }

    public static getInstance(): ExpressApp {
        if (!this.instance) {
            this.instance = new ExpressApp();
        }
        return this.instance;
    }

    public start(): void {
        this.app.listen(process.env.EXPRESS_PORT, () => {
            winston.info('listening on port: ' + process.env.EXPRESS_PORT);
        });
    }

    public setupLogging(): void {
        setupLoggers(this.app);
    }

    public setupRoutes(): void {
        this.app.use('/query', queryRouter);
    }

    public setupDocs(): void {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    public setupMissingEndpointHandling(): void {
        this.app.use((req, res, next) => {
           const error = new ServiceError('Endpoint Not found', ErrorType.NOT_FOUND, [req.url]);
           next(error);
        });
    }

    public setupErrorHandling(): void {
        this.app.use((error: ServiceError, req: Request, res: Response, next: NextFunction) => {
            if (error.errorType === ErrorType.VALIDATION) {
                return res.status(400).send({error: error.message, fields: error.errorFields});
            } else if (error.errorType === ErrorType.NOT_FOUND) {
                return res.status(404).send({error: error.message, fields: error.errorFields});
            } else {
                return res.status(500).send({error: 'Internal Server Error'});
            }
        });
    }
}
