import * as moment from 'moment';

export function removeTimeFromDateNumber(milliseconds: number): number {
    const newDate = new Date(milliseconds);
    newDate.setHours(0, 0, 0, 0);
    return newDate.getTime();
}

// used to get a a timestamp (number) from a DATE string (e.g. 10-01-2020)
export function getTimestampFromDateString(dateString: string): number {
    const [dd, mm, yyyy] =  dateString.split(/\.|\/|-/);

    return moment(`${yyyy}-${mm}-${dd}T00:00:00`).toDate().getTime();
}

export function getDateStringFromTimeStamp(timestamp: number, separator= '/'): string {
    const date = new Date(timestamp);

    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dateStr = String(date.getDate()).padStart(2, '0');
    const yearStr = String(date.getFullYear()).padStart(4, '0');

    return `${dateStr}${separator}${monthStr}${separator}${yearStr}`
}

export function getTimestampFromDatetimeString(datetimeString: string, dateTimeSeparator = ' '): number {
    const [date, time] = datetimeString.split(dateTimeSeparator);
    const [dd, mm, yyyy] =  date.split(/\.|\/|-/);

    return moment(`${yyyy}-${mm}-${dd}T${time}:00`).toDate().getTime();
}

export async function sleep(ms: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })
}
