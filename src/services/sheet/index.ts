import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import moment from 'moment';
import { appConfig } from '..';
import gsheetUtil from '../googleapis';
import { CatItem, MonthlySheetDataType, Transaction } from '../service-types';

export interface Sheet {
    getExpenseCategories(): Promise<CatItem[]>;
    getMonthData(monthSheet: string): Promise<Transaction[]>;
    setMonthData(monthSheet: string): Promise<boolean>;
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
        return new Promise<GoogleSpreadsheetWorksheet>((resolve, reject) => {
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
    }

    public async getExpenseCategories() {
        return new Promise<CatItem[]>((resolve, reject) => {
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
    }

    private async parseMonthlySheet(sheet: GoogleSpreadsheetWorksheet) {
        const rows = await sheet.getRows();
        const out: Transaction[] = rows.map((row) => ({
            Date: moment(row.Date, 'DD/MM/YYYY').toDate(),
            Description: row.Desc,
            'Cheque No': row.ChqNo,
            Debit: parseFloat(row.Amount) < 0 ? parseFloat(row.Amount) : 0,
            Credit: parseFloat(row.Amount) >= 0 ? parseFloat(row.Amount) : 0,
            Total: parseFloat(row.Balance),
            type: row.Type,
        }));
        return out;
    }

    public getMonthData(monthSheet: string) {
        return new Promise<Transaction[]>((resolve, reject) => {
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
    }

    private pushSheetData(trans: Transaction, rows: MonthlySheetDataType[]) {
        rows.push({
            Date: moment(trans.Date).format('DD-MM-YYYY'),
            Desc: trans.Description,
            Balance: trans.Total,
            Amount: trans.Credit - trans.Debit,
            ChqNo: trans['Cheque No'],
            Type: trans.type,
        });
    }

    private transCompare(sheetData: Transaction, fileData: Transaction) {
        return (
            moment(sheetData.Date).format('DD/MM/YYY') === moment(fileData.Date).format('DD/MM/YYY') &&
            sheetData.Description === fileData.Description &&
            sheetData.Debit === fileData.Debit &&
            sheetData.Credit === fileData.Credit &&
            sheetData.type === fileData.type
        );
    }

    private async mergeSheetData(sheet: GoogleSpreadsheetWorksheet, sheetData: Transaction[]) {
        const { transactions } = appConfig.appData;
        const rows: MonthlySheetDataType[] = [];
        if (sheetData.length > 0) {
            transactions.forEach((trans) => {
                const fIndex = sheetData.findIndex((sData) => this.transCompare(sData, trans));
                if (fIndex === -1) {
                    this.pushSheetData(trans, rows);
                }
            });
            sheetData.forEach((sheetTrans) => {
                const fIndex = transactions.findIndex((fileData) => this.transCompare(fileData, sheetTrans));
                if (fIndex === -1) {
                    transactions.push(sheetTrans);
                }
            });
        } else {
            transactions.forEach((trans) => this.pushSheetData(trans, rows));
        }
        if (rows.length) {
            await sheet.addRows(rows);
        }
        return true;
    }

    public async setMonthData(monthSheet: string) {
        const fetchedData = await this.getMonthData(monthSheet);
        const sheet = await this.getSheet(monthSheet);
        await this.mergeSheetData(sheet, fetchedData);
        return true;
    }
}

export default new TransSheet();
