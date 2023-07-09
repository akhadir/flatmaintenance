import {
    GoogleSpreadsheet,
    GoogleSpreadsheetCell,
    GoogleSpreadsheetRow,
    GoogleSpreadsheetWorksheet,
    WorksheetBasicProperties,
} from 'google-spreadsheet';
import { appConfig } from '..';
import catIndex from '../cat-map/cat-index';
import monthIndex from '../cat-map/month-index';
import maintIndex from '../maint-map/flat-index';
import maintenenceMonthIndex from '../maint-map/month-index';

// Config variables
export interface GSheetUtil {
    currentSheet?: string;
    init: () => Promise<GoogleSpreadsheet>;
    getSpreadSheet: () => GoogleSpreadsheet | undefined;
    getSheetByTitle: (sheetTitle: string) => Promise<GoogleSpreadsheetWorksheet>;
    getSheetByTitleAsJson: (sheetTitle: string) => Promise<{ [key: string]: any }[]>;
    getSheet: (sheetId: string) => Promise<GoogleSpreadsheetWorksheet>;
    appendSheet: (sheetId: string, row: { [key: string]: string | number }) => Promise<GoogleSpreadsheetRow>;
    append: (row: { [key: string]: string | number }) => Promise<GoogleSpreadsheetRow>;
    appendRows: (rows: { [key: string]: string | number }[]) => Promise<void>;
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
    updateSheetWithJSON: (json: { [key: string]: any }[], sheetTitle?: string) => Promise<void>;
    isEmptySheet: (sheet: GoogleSpreadsheetWorksheet) => boolean;
}

let gsheetInstance: GSheetUtil;
class GsheetUtilImpl implements GSheetUtil {
    public currentSheet: string = '';

    public init() {
        return new Promise<GoogleSpreadsheet>((resolve, reject) => {
            const { doc } = appConfig;
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
                reject(e);
            });
        });
    }

    public getSpreadSheet () {
        return appConfig.doc;
    }

    public async getSheetByTitleAsJson(sheetTitle: string): Promise<{ [key: string]: any; }[]> {
        const sheetInfo: any[] = [];
        const sheetObj = await this.getSheetByTitle(sheetTitle);
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
    }

    public async getSheetByTitle(sheetTitle: string) {
        const sheet = appConfig.doc?.sheetsByTitle[sheetTitle];
        if (sheet) {
            this.currentSheet = sheet.sheetId;
            await sheet.loadCells();
        }
        return sheet;
    }

    public async getSheet(sheetId: string) {
        this.currentSheet = sheetId;
        const sheet = appConfig.doc.sheetsById[sheetId];
        await sheet.loadCells();
        return sheet;
    }

    public appendSheet(sheetId: string, row: { [key: string]: string | number; }) {
        const sheet = appConfig.doc.sheetsById[sheetId];
        return sheet.addRow(row);
    }

    public append(row: { [key: string]: string | number; }) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        return sheet.addRow(row);
    }

    public async appendRows(rows: { [key: string]: string | number; }[]) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        await sheet.addRows(rows);
    }

    public getSheetRow(sheetId: string, row: number) {
        const sheet = appConfig.doc.sheetsById[sheetId];
        return sheet.getRows({
            limit: 1,
            offset: row,
        });
    }

    public getRow(row: number) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        return sheet.getRows({
            limit: 1,
            offset: row,
        });
    }

    public getColumn(col: number) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    }

    public getColumnWithSheet(sheet: GoogleSpreadsheetWorksheet, col: number) {
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    }

    public getSheetColumn(sheetId: string, col: number) {
        const sheet = appConfig.doc.sheetsById[sheetId];
        const result = [];
        const len = sheet.rowCount < 100 ? sheet.rowCount : 100;
        for (let i = 0; i < len - 1; i += 1) {
            result.push(sheet.getCell(i, col));
        }
        return result;
    }

    public getSheetCell(sheetId: string, row: number, column: number) {
        const sheet = appConfig.doc.sheetsById[sheetId];
        return sheet.getCell(row, column);
    }

    public getCell(row: number, column: number) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        return sheet.getCell(row, column);
    }

    public saveSheetCells(sheetId: string, cells: GoogleSpreadsheetCell[]) {
        const sheet = appConfig.doc.sheetsById[sheetId];
        return sheet.saveCells(cells);
    }

    public saveCells(cells: GoogleSpreadsheetCell[]) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        return sheet.saveCells(cells);
    }

    public addSheet (input: WorksheetBasicProperties) {
        return appConfig.doc.addSheet(input);
    }

    public async saveSheetWithJSON (json: { [key: string]: any; }[]) {
        const sheet = appConfig.doc.sheetsById[this.currentSheet || ''];
        await this.updateSheet(sheet, json);
    }

    public async updateCategorySheet(json: { [month: string]: { [cat: string]: any; }; }): Promise<void> {
        const sheet = await this.getSheetByTitle('Summary');
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
    }

    public async udpateMaintenanceSheet(json: { [month: string]: { [flat: string]: any; }; }): Promise<void> {
        const sheet = await this.getSheetByTitle('Maintanence');
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
    }

    public isEmptySheet(sheet: GoogleSpreadsheetWorksheet): boolean {
        return !sheet || sheet.rowCount === 0;
    }

    private async updateSheet(
        sheet: GoogleSpreadsheetWorksheet,
        json: { [key: string]: any; }[],
        startingRow: number = 0,
    ) {
        if (json && json.length) {
            const headers = Object.keys(json[0]);
            const colCount = headers.length;
            const rowCount = startingRow + json.length;
            for (let i = startingRow; i < rowCount; i += 1) {
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
        await sheet.saveUpdatedCells();
    }

    public async updateSheetWithJSON(json: { [key: string]: any; }[], sheetTitle?: string): Promise<void> {
        if (sheetTitle) {
            await this.getSheetByTitle(sheetTitle);
        }
        await this.appendRows(json);
    }

    static getInstance() {
        if (!gsheetInstance) {
            gsheetInstance = new GsheetUtilImpl();
        }
        return gsheetInstance;
    }
}

export default GsheetUtilImpl.getInstance();
