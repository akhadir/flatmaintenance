/* eslint-disable max-len */
import React from 'react';
import moment from 'moment';
import { fetchFilesFromFolder } from '../../services/googleapis/drive-util';
import gsheetUtil from '../../services/googleapis/gsheet-util-impl';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import TransMapExecutor from '../../utils/trans-map-executor';
import { TransCategory } from '../../utils/trans-category';
import catMapJson from '../../services/cat-map/cat-map';
import { parseExpenseInfo } from '../../services/ocr/parser-utils';
import { getVision as getOCRVision } from '../../services/ocr';
import Ollama, { OllamaApiResponse } from '../../services/ollama';
import { Gemini, ProcessedData } from '../../services/googleapis/gemini';
import { TransactionType } from '../../services/redux/transactions/trans-types';
import { getConfig } from '../../services';

const USE_OLLAMA = true;

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
    const category = Ollama.getCategory(data);
    const value: TransactionType = getDataInSheetFormat(data);
    if (!value.Description && longDescription) {
        value.Description = longDescription;
    }
    const transMapExec = new TransMapExecutor(catMapJson as any);
    transMapExec.run([value] as TransactionType[]);
    data.category = value.Category;
    if (!data.description && data.category) {
        data.description = data.category;
    }
};

const BillDataCache: { [cacheKey: string]: any } = {};

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
            if (BillDataCache[bill.id]) {
                resolve(BillDataCache[bill.id]);
            } else {
                const { googleAPIKey: apiKey } = getConfig();
                // const fileUrl = `https://drive.usercontent.google.com/download?id=${bill.id}`;
                const fileUrl = `https://www.googleapis.com/drive/v2/files/${bill.id}?key=${apiKey}&alt=media&source=downloadUrl`;
                const getFunc = USE_OLLAMA ? Ollama.getVision.bind(Ollama) : getOCRVision;
                const visionHandler = USE_OLLAMA
                    ? handleOllamaResponse
                    : handleOCRSpaceResponse;
                getVisionRetry(fileUrl, getFunc).then(async (response: any) => {
                    const parsedFormData = await visionHandler(response, data);
                    BillDataCache[bill.id] = parsedFormData;
                    resolve(parsedFormData);
                });
            }
        } else {
            const parsedFormData = ({
                ...data,
            });
            resolve(parsedFormData);
        }
    });
    return promise;
}
const handleOllamaResponse = async (response: OllamaApiResponse) => {
    const parsedResp = JSON.parse(response.message.content);
    const data: ExpenseState = JSON.parse(response.message.content);
    if (!data.date || data.date.length !== 10) {
        data.date = '01-01-2024';
    }
    data.isChequeIssued = !parsedResp.cash;
    if (!data.category) {
        const catResp = await Ollama.getCategory(parsedResp.description);
        if (catResp) {
            data.category = JSON.parse(response.message.content).category;
        }
    }
    return Promise.resolve(data);
};
const handleOCRSpaceResponse = async (response: any, data: ExpenseState) => {
    let parsedFormData: ExpenseState;
    if (response?.data?.ParsedResults) {
        const parsedText = response.data.ParsedResults[0]?.ParsedText || '';
        const parsedData: ProcessedData = await Gemini.getInstance().extractData(parsedText);
        parsedFormData = {
            ...parsedData,
            isChequeIssued:
                (typeof parsedData.isChequeIssued === 'boolean') ?
                    parsedData.isChequeIssued : parsedData.isChequeIssued === 'true',
        };
        setCategory(parsedFormData, parsedText!.toLowerCase());
    } else {
        parsedFormData = ({
            ...data,
        });
        setCategory(parsedFormData);
    }
    return parsedFormData;
};
const getVisionRetry = (url: string, getVision: (url: string) => any, RETRY_COUNT = 3) => {
    const promise = new Promise((resolve, reject) => {
        getVision(url).then(async (response: any) => {
            RETRY_COUNT -= 1;
            if (response || RETRY_COUNT === 0) {
                resolve(response);
            } else if (!response) {
                const resp = await getVisionRetry(url, getVision, RETRY_COUNT);
                resolve(resp);
            }
        });
    });
    return promise;
};

export default { fetchFiles, saveCashTransSheet, saveOnlineTransSheet };
