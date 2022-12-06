import { DateTime } from "luxon";

const formatDate = (date, format) => {
    return DateTime.fromISO(new Date(date).toISOString())
        .setLocale('it')
        .toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
}; 

const adjacentCells = (col, row, maxCol, maxRow) => {
    if(!maxRow) maxRow = maxCol;
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

export { formatDate, adjacentCells };