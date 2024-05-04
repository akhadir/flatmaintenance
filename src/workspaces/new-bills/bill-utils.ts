import React from 'react';
import moment from 'moment';
import { fetchFilesFromFolder } from '../../services/googleapis/drive-util';
import gsheetUtil from '../../services/googleapis/gsheet-util-impl';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import TransMapExecutor from '../../utils/trans-map-executor';
import { TransactionType } from '../../services/redux/transactions/trans-types';
import { TransCategory } from '../../utils/trans-category';
import catMapJson from '../../services/cat-map/cat-map';
import { parseExpenseInfo } from '../../services/ocr/parser-utils';
import { getVision } from '../../services/ocr';

export function fetchFiles(
    setFilesList: React.Dispatch<React.SetStateAction<GoogleDriveFile[]>>,
    folderId: string = '',
) {
    fetchFilesFromFolder(folderId).then((files) => {
        setFilesList(files);
    });
}

export const saveOnlineTransSheet = async (data: any, sheetTitle = 'Online Transactions') => {
    const sheet = await gsheetUtil.getSheetByTitle(sheetTitle);
    if (!sheet) {
        await gsheetUtil.addSheet({
            headerValues: [
                'Date', 'Description', 'Cheque No', 'Debit', 'Credit', 'Total', 'Category', 'Flat', 'Bill',
            ],
            title: sheetTitle,
        });
    }
    const sheetData = (JSON.parse(JSON.stringify(data)) as any[]).map((row) => {
        row.Date = moment(row.Date).format('DD-MM-YYYY');
        return row;
    });
    await gsheetUtil.updateSheetWithJSON(sheetData, sheetTitle);
    return true;
};

export const saveOnlineTransactionWithBill = async (data: ExpenseState, fileId: string) => {
    await searchUpdateOnlineTransWithBills(data.date, data.amount, data.category || '', getDriveFileURL(fileId));
};

export async function searchUpdateOnlineTransWithBills(
    date: any,
    debit: any,
    category: string,
    billURL: string,
) {
    let searchColumns: Record<string, any> = {
        Date: date,
        Debit: debit,
        Category: category,
    };
    try {
        await gsheetUtil.searchUpdateRecord('Online Transactions', searchColumns, 'Bill', billURL);
    } catch (e) {
        searchColumns = {
            Debit: debit,
            Category: category,
        };
        await gsheetUtil.searchUpdateRecord('Online Transactions', searchColumns, 'Bill', billURL);
    }
}

export const saveCashTransSheet = async (data: any, sheetTitle = 'Cash Transactions') => {
    const sheet = await gsheetUtil.getSheetByTitle(sheetTitle);
    if (!sheet) {
        await gsheetUtil.addSheet({
            headerValues: [
                'Date',
                'Description',
                'Item Description/Purpose',
                'Qty',
                'Price',
                'Debit',
                'Credit',
                'Total',
                'Category',
                'Flat',
                'Bill',
            ],
            title: sheetTitle,
        });
    }
    const sheetData = JSON.parse(JSON.stringify(data));
    await gsheetUtil.updateSheetWithJSON(sheetData, sheetTitle);
    return true;
};

export const getDriveFileURL = (fileId: string) => `https://drive.google.com/file/d/${fileId}/preview`;

export const getDataInSheetFormat = (data: ExpenseState, selectedBill?: string) => {
    const out: TransactionType = {
        Date: data.date ?? '',
        Description: data.description ?? '',
        Debit: data.amount ?? 0,
        Credit: 0,
        Category: data.category as TransCategory,
        Total: 0,
    };
    if (selectedBill) {
        out.Bill = getDriveFileURL(selectedBill);
    }
    return out;
};

export const setCategory = (data: ExpenseState, longDescription?: string) => {
    const value: TransactionType = getDataInSheetFormat(data);
    if (longDescription) {
        value.Description = longDescription;
    }
    const transMapExec = new TransMapExecutor(catMapJson as any);
    transMapExec.run([value] as TransactionType[]);
    data.category = value.Category;
    if (data.category) {
        data.description = data.category;
    }
};

export function extractBillData(
    fileName: string | undefined,
    bill: GoogleDriveFile,
): Promise<ExpenseState> {
    let data: ExpenseState = {};
    const promise = new Promise<ExpenseState>((resolve) => {
        if (fileName && fileName.indexOf('_') > -1) {
            data = parseExpenseInfo(fileName);
        }
        if (!data.amount || !data.date || !data.description) {
            getVision(`https://drive.google.com/uc?id=${bill.id}`).then((response: any) => {
                if (response && response.data && response.data.ParsedResults) {
                    const parsedText = response.data.ParsedResults[0]?.ParsedText || '';
                    const parsedData = parseExpenseInfo(parsedText);
                    parsedData.amount = data.amount && data.amount > 0 ? data.amount : parsedData.amount;
                    parsedData.description = data.description ?? parsedData.description;
                    parsedData.date = data.date ? data.date : parsedData.date;
                    const parsedFormData = {
                        ...parsedData,
                    };
                    setCategory(parsedFormData, parsedText!.toLowerCase());
                    resolve(parsedFormData);
                } else {
                    const parsedFormData = ({
                        ...data,
                    });
                    setCategory(parsedFormData);
                    resolve(parsedFormData);
                }
            });
        } else {
            const parsedFormData = ({
                ...data,
            });
            setCategory(parsedFormData);
            resolve(parsedFormData);
        }
    });
    return promise;
}

export default { fetchFiles, saveCashTransSheet, saveOnlineTransSheet };
