import {
    GoogleSpreadsheet,
    GoogleSpreadsheetCell,
    GoogleSpreadsheetRow,
    GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet';

// Config variables
const SPREADSHEET_ID = '1DkvPBSTUHJB9nnd31pfR7-n-71e4OtV5jHs2LHaWcKM';
const CLIENT_EMAIL = '';
// eslint-disable-next-line quotes,max-len
const PRIVATE_KEY = "";

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
export type GSheetUtil = {
    currentSheet?: string;
    init: () => Promise<GoogleSpreadsheet>;
    getSpreadSheet: () => GoogleSpreadsheet;
    getSheetByTitle: (sheetTitle: string) => Promise<GoogleSpreadsheetWorksheet>;
    getSheet: (sheetId: string) => Promise<GoogleSpreadsheetWorksheet>;
    appendSheet: (sheetId: string, row: { [key: string]: string | number }) => Promise<GoogleSpreadsheetRow>;
    append: (row: { [key: string]: string | number }) => Promise<GoogleSpreadsheetRow>;
    getSheetRow: (sheetId: string, row: number) => Promise<GoogleSpreadsheetRow[]>;
    getRow: (row: number) => Promise<GoogleSpreadsheetRow[]>;
    getColumn: (col: number) => GoogleSpreadsheetCell[];
    getSheetColumn: (sheetId: string, col: number) => GoogleSpreadsheetCell[];
    getSheetCell: (sheetId: string, row: number, column: number) => GoogleSpreadsheetCell;
    getCell: (row: number, column: number) => GoogleSpreadsheetCell;
    saveSheetCells: (sheetId: string, cells: GoogleSpreadsheetCell[]) => Promise<void>;
    saveCells: (cells: GoogleSpreadsheetCell[]) => Promise<void>;
}
const gsheetUtil: GSheetUtil = {
    currentSheet: '',
    init: () => {
        const prom = new Promise<GoogleSpreadsheet>((resolve, reject) => {
            doc.useServiceAccountAuth({
                client_email: CLIENT_EMAIL,
                private_key: PRIVATE_KEY,
            }).then(() => {
                doc.loadInfo().then(() => {
                    resolve(doc);
                }).catch((e) => {
                    console.log(e);
                });
            }).catch((e) => {
                console.log(e);
            });
        });
        return prom;
    },
    getSpreadSheet: () => doc,
    getSheetByTitle: async (sheetTitle: string) => {
        const sheet = doc.sheetsByTitle[sheetTitle];
        gsheetUtil.currentSheet = sheet.sheetId;
        await sheet.loadCells();
        return sheet;
    },
    getSheet: async (sheetId: string) => {
        gsheetUtil.currentSheet = sheetId;
        const sheet = doc.sheetsById[sheetId];
        await sheet.loadCells();
        return sheet;
    },
    appendSheet: (sheetId: string, row: { [key: string]: string | number }) => {
        const sheet = doc.sheetsById[sheetId];
        const result = sheet.addRow(row);
        return result;
    },
    append: (row: { [key: string]: string | number }) => {
        const sheet = doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.addRow(row);
        return result;
    },
    getSheetRow: (sheetId: string, row: number) => {
        const sheet = doc.sheetsById[sheetId];
        const result = sheet.getRows({
            limit: 1,
            offset: row,
        });
        return result;
    },
    getRow: (row: number) => {
        const sheet = doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.getRows({
            limit: 1,
            offset: row,
        });
        return result;
    },
    getColumn: (col: number) => {
        const sheet = doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    },
    getSheetColumn: (sheetId: string, col: number) => {
        const sheet = doc.sheetsById[sheetId];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    },
    getSheetCell: (sheetId: string, row: number, column: number) => {
        const sheet = doc.sheetsById[sheetId];
        const result = sheet.getCell(row, column);
        return result;
    },
    getCell: (row: number, column: number) => {
        const sheet = doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.getCell(row, column);
        return result;
    },
    saveSheetCells: (sheetId: string, cells: GoogleSpreadsheetCell[]) => {
        const sheet = doc.sheetsById[sheetId];
        const result = sheet.saveCells(cells);
        return result;
    },
    saveCells: (cells: GoogleSpreadsheetCell[]) => {
        const sheet = doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.saveCells(cells);
        return result;
    },
};

export default gsheetUtil;
