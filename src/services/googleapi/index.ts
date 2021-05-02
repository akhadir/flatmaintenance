import {
    GoogleSpreadsheet,
    GoogleSpreadsheetCell,
    GoogleSpreadsheetRow,
    GoogleSpreadsheetWorksheet,
    WorksheetBasicProperties,
} from 'google-spreadsheet';
import { appConfig } from '..';

// Config variables
export type GSheetUtil = {
    currentSheet?: string;
    init: () => Promise<GoogleSpreadsheet>;
    getSpreadSheet: () => GoogleSpreadsheet | undefined;
    getSheetByTitle: (sheetTitle: string) => Promise<GoogleSpreadsheetWorksheet>;
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
    saveCells: (cells: GoogleSpreadsheetCell[]) => Promise<void>;
    addSheet: (input: WorksheetBasicProperties) => Promise<GoogleSpreadsheetWorksheet>;
}
const gsheetUtil: GSheetUtil = {
    currentSheet: '',
    init: () => {
        const prom = new Promise<GoogleSpreadsheet>((resolve, reject) => {
            const { doc } = appConfig;
            try {
                doc.useServiceAccountAuth({
                    client_email: appConfig.clientEmail || '',
                    private_key: appConfig.privateKey || '',
                }).then(() => {
                    doc.loadInfo().then(() => {
                        resolve(doc);
                    }).catch((e: any) => {
                        console.log(e);
                    });
                }).catch((e: any) => {
                    console.log(e);
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
        return prom;
    },
    getSpreadSheet: () => appConfig.doc,
    getSheetByTitle: async (sheetTitle: string) => {
        const sheet = appConfig.doc?.sheetsByTitle[sheetTitle];
        if (sheet) {
            gsheetUtil.currentSheet = sheet.sheetId;
            await sheet.loadCells();
        }
        return sheet;
    },
    getSheet: async (sheetId: string) => {
        gsheetUtil.currentSheet = sheetId;
        const sheet = appConfig.doc.sheetsById[sheetId];
        await sheet.loadCells();
        return sheet;
    },
    appendSheet: (sheetId: string, row: { [key: string]: string | number }) => {
        const sheet = appConfig.doc.sheetsById[sheetId];
        const result = sheet.addRow(row);
        return result;
    },
    append: (row: { [key: string]: string | number }) => {
        const sheet = appConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.addRow(row);
        return result;
    },
    getSheetRow: (sheetId: string, row: number) => {
        const sheet = appConfig.doc.sheetsById[sheetId];
        const result = sheet.getRows({
            limit: 1,
            offset: row,
        });
        return result;
    },
    getRow: (row: number) => {
        const sheet = appConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.getRows({
            limit: 1,
            offset: row,
        });
        return result;
    },
    getColumn: (col: number) => {
        const sheet = appConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
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
        const sheet = appConfig.doc.sheetsById[sheetId];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    },
    getSheetCell: (sheetId: string, row: number, column: number) => {
        const sheet = appConfig.doc.sheetsById[sheetId];
        const result = sheet.getCell(row, column);
        return result;
    },
    getCell: (row: number, column: number) => {
        const sheet = appConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.getCell(row, column);
        return result;
    },
    saveSheetCells: (sheetId: string, cells: GoogleSpreadsheetCell[]) => {
        const sheet = appConfig.doc.sheetsById[sheetId];
        const result = sheet.saveCells(cells);
        return result;
    },
    saveCells: (cells: GoogleSpreadsheetCell[]) => {
        const sheet = appConfig.doc.sheetsById[gsheetUtil.currentSheet || ''];
        const result = sheet.saveCells(cells);
        return result;
    },
    addSheet: (input: WorksheetBasicProperties) => appConfig.doc.addSheet(input),
};

export default gsheetUtil;
