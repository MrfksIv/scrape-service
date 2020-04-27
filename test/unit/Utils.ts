import 'mocha';
import * as assert from 'assert';

import { removeTimeFromDateNumber, getTimestampFromDateString } from '../../src/utils';

describe('utility functions should return the correct results', () => {

    describe('removeTimeFromDateNumber', () => {
        it('should return the same datestamp with minutes, hours, seconds & ms set to 0', () => {
           const date = new Date();
           const dateWithoutTime = removeTimeFromDateNumber(date.getTime());
           const dateWithoutTimeObj = new Date(dateWithoutTime);

           // make sure that the date part is the same as the original date
           assert.strictEqual(date.getDate(), dateWithoutTimeObj.getDate());
           assert.strictEqual(date.getMonth(), dateWithoutTimeObj.getMonth());
           assert.strictEqual(date.getFullYear(), dateWithoutTimeObj.getFullYear());

           // make sure that the time part is set to 0
           assert.strictEqual(dateWithoutTimeObj.getHours(), 0);
           assert.strictEqual(dateWithoutTimeObj.getMinutes(), 0);
           assert.strictEqual(dateWithoutTimeObj.getSeconds(), 0);
           assert.strictEqual(dateWithoutTimeObj.getMilliseconds(), 0);
        });
    });

    describe('getTimestampFromDateString', () => {
        it ('should correctly convert date strings to timestamps', () => {
            const {day, month, year} = {day: '10', month: '12', year: '2020'};

            const dateString = `${day}/${month}/${year}`;
            const timeStamp = getTimestampFromDateString(dateString);

            const timeStampObj = new Date(timeStamp);
            assert.strictEqual(timeStampObj.getDate(), Number(day));
            assert.strictEqual(timeStampObj.getMonth(), Number(month) - 1); // months are 0 - 11
            assert.strictEqual(timeStampObj.getFullYear(), Number(year));

            assert.strictEqual(timeStampObj.getHours(), 0);
            assert.strictEqual(timeStampObj.getMinutes(), 0);
            assert.strictEqual(timeStampObj.getSeconds(), 0);
            assert.strictEqual(timeStampObj.getMilliseconds(), 0);

        });
    });
})
