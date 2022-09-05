import {
    GoogleSpreadsheet,
    GoogleSpreadsheetCell,
    GoogleSpreadsheetRow,
    GoogleSpreadsheetWorksheet,
    WorksheetBasicProperties,
} from 'google-spreadsheet';
import { sheetConfig } from '..';
import catIndex from '../cat-map/cat-index';
import monthIndex from '../cat-map/month-index';
import maintIndex from '../maint-map/flat-index';
import maintenenceMonthIndex from '../maint-map/month-index';

// Config variables
export type GSheetUtil = {
    currentSheet?: string;
    init: () => Promise<GoogleSpreadsheet>;
    getSpreadSheet: () => GoogleSpreadsheet | undefined;
    getSheetByTitle: (sheetTitle: string) => Promise<GoogleSpreadsheetWorksheet>;
    getSheetByTitleAsJson: (sheetTitle: string) => Promise<{ [key: string]: any }[]>;
    getSheet: (sheetId: string) => Promise<GoogleSpreadsheetWorksheet>;
    appendSheet: (sheetId: string, row: { [key: string]: string | number }) => Promise<GoogleSpreadsheetRow>;
    append: (row: { [key: string]: string | number }) => Promise<GoogleSpreadsheetRow>;
    getSheetRow: (sheetId: string, row: number) => Promise<GoogleSpreadsheetRow[]>;
    getRow: (row: number) => Promise<GoogleSpreadsheetRow[]>;
    getColumn: (col: number) => GoogleSpreadsheetCell[];
    getColumnWithSheet: (sheet: GoogleSpreadsheetWorksheet, col: number) => GoogleSpreadsheetCell[];
    getSheetColumn: (sheetId: string, col: number) => GoogleSpreadsheetCell[];
    getSheetCell: (sheetId: string, row: number, column: number) => GoogleSpreadsheetCell;
    getCell: (row: number, column: number) => GoogleSpreadsheetCell;
    saveSheetCells: (sheetId: string, cells: GoogleSpreadsheetCell[]) => Promise<void>;
    saveSheetWithJSON: (json: { [key: string]: any }[]) => Promise<void>;
    updateCategorySheet: (json: { [month: string]: { [cat: string]: any }}) => Promise<void>;
    udpateMaintenanceSheet: (json: { [month: string]: { [flat: string]: any }}) => Promise<void>;
    saveCells: (cells: GoogleSpreadsheetCell[]) => Promise<void>;
    addSheet: (input: WorksheetBasicProperties) => Promise<GoogleSpreadsheetWorksheet>;
}
const gsheetUtil: GSheetUtil = {
    currentSheet: '',
    init: () => new Promise<GoogleSpreadsheet>((resolve, reject) => {
        const { doc } = sheetConfig;
        doc.useServiceAccountAuth({
            client_email: sheetConfig.clientEmail || '',
            private_key: sheetConfig.privateKey || '',
        }).then(() => {
            doc.loadInfo().then(() => {
                resolve(doc);
            }).catch((e: any) => {
                console.log(e);
            });
        }).catch((e: any) => {
            console.log(e);
            reject(e);
        });
    }),
    getSpreadSheet: () => sheetConfig.doc,
    getSheetByTitleAsJson: async (sheetTitle: string): Promise<{ [key: string]: any; }[]> => {
        const sheetInfo: any[] = [];
        const sheetObj = await gsheetUtil.getSheetByTitle(sheetTitle);
        let headers: string[] = sheetObj.headerValues;
        let colCount = sheetObj.columnCount;
        if (!headers || headers.length === 0) {
            headers = [];
            for (let j = 0; j < colCount; j += 1) {
                const { value } = sheetObj.getCell(0, j);
                if (value) {
                    headers.push(sheetObj.getCell(0, j).value.toString());
                }
            }
        }
        colCount = headers.length;
        const { rowCount } = sheetObj;
        for (let i = 1; i < rowCount; i += 1) {
            const sheet: any = {};
            const allValues: any[] = [];
            for (let j = 0; j < colCount; j += 1) {
                const head = headers[j];
                const val = sheetObj.getCell(i, j).formattedValue;
                sheet[head] = val;
                allValues.push(val);
            }
            if (allValues.some((val) => val !== null)) {
                sheetInfo.push(sheet);
            } else {
                break;
            }
        }
        return sheetInfo;
    },
    getSheetByTitle: async (sheetTitle: string) => {
        const sheet = sheetConfig.doc?.sheetsByTitle[sheetTitle];
        if (sheet) {
            gsheetUtil.currentSheet = sheet.sheetId;
            await sheet.loadCells();
        }
        return sheet;
    },
    getSheet: async (sheetId: string) => {
        gsheetUtil.currentSheet = sheetId;
        const sheet = sheetConfig.doc.sheetsById[sheetId];
        await sheet.loadCells();
        return sheet;
    },
    appendSheet: (sheetId: string, row: { [key: string]: string | number; }) => {
        const sheet = sheetConfig.doc.sheetsById[sheetId];
        return sheet.addRow(row);
    },
    append: (row: { [key: string]: string | number; }) => {
        const sheet = sheetConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        return sheet.addRow(row);
    },
    getSheetRow: (sheetId: string, row: number) => {
        const sheet = sheetConfig.doc.sheetsById[sheetId];
        return sheet.getRows({
            limit: 1,
            offset: row,
        });
    },
    getRow: (row: number) => {
        const sheet = sheetConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        return sheet.getRows({
            limit: 1,
            offset: row,
        });
    },
    getColumn: (col: number) => {
        const sheet = sheetConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    },
    getColumnWithSheet: (sheet: GoogleSpreadsheetWorksheet, col: number) => {
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    },
    getSheetColumn: (sheetId: string, col: number) => {
        const sheet = sheetConfig.doc.sheetsById[sheetId];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    },
    getSheetCell: (sheetId: string, row: number, column: number) => {
        const sheet = sheetConfig.doc.sheetsById[sheetId];
        return sheet.getCell(row, column);
    },
    getCell: (row: number, column: number) => {
        const sheet = sheetConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        return sheet.getCell(row, column);
    },
    saveSheetCells: (sheetId: string, cells: GoogleSpreadsheetCell[]) => {
        const sheet = sheetConfig.doc.sheetsById[sheetId];
        return sheet.saveCells(cells);
    },
    saveCells: (cells: GoogleSpreadsheetCell[]) => {
        const sheet = sheetConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        return sheet.saveCells(cells);
    },
    addSheet: (input: WorksheetBasicProperties) => sheetConfig.doc.addSheet(input),
    saveSheetWithJSON: (json: { [key: string]: any; }[]): Promise<void> => {
        const sheet = sheetConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        if (json && json.length) {
            const headers = Object.keys(json[0]);
            const colCount = headers.length;
            const rowCount = json.length;
            for (let i = 0; i < rowCount; i += 1) {
                const row = json[i];
                for (let j = 0; j < colCount; j += 1) {
                    const cell = sheet.getCell(i + 1, j);
                    const newVal = row[headers[j]];
                    if (cell.formattedValue !== newVal) {
                        cell.value = newVal;
                    }
                }
            }
        }
        return sheet.saveUpdatedCells();
    },
    updateCategorySheet: async (json: { [month: string]: { [cat: string]: any; }; }): Promise<void> => {
        const sheet = await gsheetUtil.getSheetByTitle('Summary');
        await sheet.loadCells();
        const months = Object.keys(json);
        months.forEach((month) => {
            const monthData = json[month];
            const categories = Object.keys(monthData);
            const mIndex = month.replace(/-\d+$/, '');
            const colIndex: number = monthIndex[mIndex];
            categories.forEach((cat) => {
                const rowIndex = catIndex[cat];
                if (typeof rowIndex !== 'undefined' && typeof colIndex !== 'undefined') {
                    const cell = sheet.getCell(rowIndex, colIndex);
                    cell.value = monthData[cat];
                }
            });
        });
        return sheet.saveUpdatedCells();
    },
    udpateMaintenanceSheet: async (json: { [month: string]: { [flat: string]: any; }; }): Promise<void> => {
        const sheet = await gsheetUtil.getSheetByTitle('Maintanence');
        await sheet.loadCells();
        const months = Object.keys(json);
        months.forEach((month) => {
            const monthData = json[month];
            const flats = Object.keys(maintIndex);
            const mIndex = month.replace(/-\d+$/, '');
            const colIndex: number = maintenenceMonthIndex[mIndex];
            flats.forEach((flat) => {
                const rowIndex = maintIndex[flat];
                if (typeof rowIndex !== 'undefined' && typeof colIndex !== 'undefined') {
                    const cell = sheet.getCell(rowIndex, colIndex);
                    cell.value = monthData[flat];
                }
            });
        });
        return sheet.saveUpdatedCells();
    },
};

export default gsheetUtil;
