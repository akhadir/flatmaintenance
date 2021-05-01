import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import gsheetUtil from '../googleapi';
import { CatItem } from '../service-types';

export interface Sheet {
    getExpenseCategories(): Promise<CatItem[]>;
}
const EXP_STOP_ROW_VAL = 'Total Expense';
const CAT_COLUMN = 0;
const SUMMARY_SHEET = 'Summary';

export class TransSheet implements Sheet {
    private initProm: Promise<GoogleSpreadsheet>;
    private sheetIntialized = false;
    private sheets: Map<string, GoogleSpreadsheetWorksheet> = new Map<string, GoogleSpreadsheetWorksheet>();

    constructor() {
        this.initProm = gsheetUtil.init();
        this.initProm.then(() => {
            this.sheetIntialized = true;
        });
    }

    private async getSheet(sheetTitle: string) {
        if (!this.sheetIntialized) {
            await this.initProm;
        }
        const prom = new Promise<GoogleSpreadsheetWorksheet>((resolve, reject) => {
            if (this.sheets.has(sheetTitle)) {
                resolve(this.sheets.get(sheetTitle) as GoogleSpreadsheetWorksheet);
            } else {
                gsheetUtil.getSheetByTitle(SUMMARY_SHEET).then((sheet) => {
                    this.sheets.set(sheetTitle, sheet);
                    resolve(sheet);
                });
            }
        });
        return prom;
    }

    public async getExpenseCategories() {
        const prom = new Promise<CatItem[]>((resolve, reject) => {
            let result: CatItem[] = [];
            this.getSheet(SUMMARY_SHEET).then((sheet) => {
                const sheetCol = gsheetUtil.getColumnWithSheet(sheet, CAT_COLUMN);
                const expList = sheetCol.map((col) => col.value);
                const filteredExpList = [];
                for (let i = 1; i < expList.length - 1; i += 1) {
                    if (expList[i] !== EXP_STOP_ROW_VAL) {
                        filteredExpList.push(expList[i]);
                        result = filteredExpList.map((expense: any) => ({
                            key: expense,
                            label: expense,
                        }));
                    } else {
                        break;
                    }
                }
                resolve(result);
            });
        });
        return prom;
    }
}

export default TransSheet;
