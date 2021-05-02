import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { months } from 'moment';
import gsheetUtil from '../googleapi';
import { CatItem, Transaction } from '../service-types';

export interface Sheet {
    getExpenseCategories(): Promise<CatItem[]>;
    getMonthData(monthSheet: string): Promise<Transaction[]>;
    setMonthData(monthSheet: string, transactionData: Transaction): Promise<boolean>;
}
const EXP_STOP_ROW_VAL = 'Total Expense';
const CAT_COLUMN = 0;
const SUMMARY_SHEET = 'Summary';
const MONTHS_SHORT_TXT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                gsheetUtil.getSheetByTitle(sheetTitle).then((sheet) => {
                    if (sheet) {
                        this.sheets.set(sheetTitle, sheet);
                        resolve(sheet);
                    } else {
                        reject();
                    }
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

    private async parseMonthlySheet(sheet: GoogleSpreadsheetWorksheet) {
        const rows = await sheet.getRows();
        const out: Transaction[] = rows.map((row) => ({
            date: row.Date,
            desc: row.Desc,
            chqNo: row.ChqNo,
            withDrawal: row.Amount < 0 ? row.Amount : 0,
            deposit: row.Amount >= 0 ? row.Amount : 0,
            balance: row.Balance,
            type: row.Type,
        }));
        return out;
    }

    public getMonthData(monthSheet: string) {
        const prom = new Promise<Transaction[]>((resolve, reject) => {
            this.getSheet(monthSheet).then(async (sheet) => {
                const result = await this.parseMonthlySheet(sheet);
                resolve(result);
            }).catch(() => {
                gsheetUtil.addSheet({
                    headerValues: [
                        'Date', 'Desc', 'ChqNo', 'Amount', 'Type', 'Balance',
                    ],
                    title: monthSheet,
                }).then((sheet) => {
                    this.sheets.set(monthSheet, sheet);
                    resolve([]);
                });
            });
        });
        return prom;
    }

    public setMonthData(monthSheet: string, transactionData: Transaction) {
        const prom = new Promise<boolean>((resolve, reject) => {
            resolve(true);
        });
        return prom;
    }
}

export default new TransSheet();
