import * as winston from 'winston';
import * as morgan from 'morgan';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import { Application } from 'express';

export function setupLoggers(app: Application) {
    const winstonMorganLogger = winston.createLogger();

    winstonMorganLogger.add(
        new DailyRotateFile({
            filename: 'logs/http-requests-log-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            json: false
        })
    );

    winston.add(
        new DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()),
            filename: 'logs/service-log-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            json: false
        })
    );

    winston.add(new winston.transports.Console({ format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
        ) }));

    const morganStream = {
        write: (text: string) => {
            winstonMorganLogger.info(text.trim()); // proxy everything to winston
        }
    };

    // TODO remove this or fix!
    app.use(morgan('combined', { stream: morganStream }));
    app.use(morgan('short'));

    winston.info('the loggers have been set successfully...');
    return this;
}
