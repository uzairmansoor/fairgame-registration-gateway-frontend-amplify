import * as moment from 'moment';
import * as timezone from 'moment-timezone';

export function formatDateTime(date: any, format: any) {
    return moment(date).format(format);
}
// convert local time to another timezone
export function convertLocalToTimezone(localDt: string | Date, localDtFormat: string, timeZone: string, format = 'YYYY-MM-DD hh:mm:ss') {
    return timezone(localDt, localDtFormat).tz(timeZone).format(format);
}

export function toLocal(data: string | Date | moment.Moment): moment.Moment {
    return moment.utc(data).local();
}

export function toUTC(data: string | Date | moment.Moment): moment.Moment {
    return moment(data).utc();
}

export function compareDate(date1: any, date2: any) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    const same = d1.getTime() === d2.getTime();
    if (same) {
        return false;
    }
    return d1 > d2;
}
