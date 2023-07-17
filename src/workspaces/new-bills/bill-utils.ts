import React from 'react';
import moment from 'moment';
import { fetchFilesFromFolder } from '../../services/googleapis/drive-util';
import gsheetUtil from '../../services/googleapis/gsheet-util-impl';
import { GoogleDriveFile } from './expense-types';

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

export default { fetchFiles, saveCashTransSheet, saveOnlineTransSheet };
