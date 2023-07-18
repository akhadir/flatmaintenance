import React from 'react';
import moment from 'moment';
import { fetchFilesFromFolder } from '../../services/googleapis/drive-util';
import gsheetUtil from '../../services/googleapis/gsheet-util-impl';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import TransMapExecutor from '../../utils/trans-map-executor';
import { TransactionType } from '../../services/redux/transactions/trans-types';
import { TransCategory } from '../../utils/trans-category';
import catMapJson from '../../services/cat-map/cat-map';

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

export const getDriveFileURL = (fileId: string) => `https://drive.google.com/uc?id=${fileId}`;

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

export const setCategory = (data: ExpenseState) => {
    const value: TransactionType = getDataInSheetFormat(data);
    const transMapExec = new TransMapExecutor(catMapJson as any);
    transMapExec.run([value] as TransactionType[]);
    data.category = value.Category;
};

export default { fetchFiles, saveCashTransSheet, saveOnlineTransSheet };
