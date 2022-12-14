import { DateTime } from "luxon";

const lastDeployDate = new Date();

const formatDate = (date, format) => {
    return DateTime.fromISO(new Date(date).toISOString())
        .setLocale('it')
        .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
};

const adjacentCells = (col, row, maxCol, maxRow) => {
    if (!maxRow) maxRow = maxCol;
    var cells = Array();
    var startCol = col - 1 >= 0 ? col - 1 : 0;
    var endCol = col + 1 < maxCol ? col + 1 : col;
    var startRow = row - 1 >= 0 ? row - 1 : 0;
    var endRow = row + 1 < maxRow ? row + 1 : row;
    for (let colId = startCol; colId < endCol + 1; colId++)
        for (let rowId = startRow; rowId < endRow + 1; rowId++)
            if (!(rowId == row && colId == col))
                cells.push({
                    col: colId,
                    row: rowId,
                });
    return cells;
}

const delayFunction = (fn, ms) => {
    let timer = 0;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(fn.bind(this, ...args), ms || 0);
    };
};

const toTrimmedAlphanumeric = (inputString) => {
    return inputString.replace(/[^a-zA-Z0-9 ]/g, '').trim();
}

const slugify = ( text ) => {
    return text
        .toString()
        .normalize( 'NFD' )                   // split an accented letter in the base letter and the acent
        .replace( /[\u0300-\u036f]/g, '' )   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-'); 
};

export { lastDeployDate, formatDate, adjacentCells, delayFunction, toTrimmedAlphanumeric, slugify };