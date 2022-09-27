import { DateTime } from "luxon";

const formatDate = (date, format) => {
    return DateTime.fromISO(new Date(date).toISOString())
        .setLocale('it')
        .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
}; 

export { formatDate };