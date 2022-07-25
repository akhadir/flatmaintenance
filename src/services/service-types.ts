import { GoogleSpreadsheet } from 'google-spreadsheet';

export type Transaction = {
    Date: Date;
    Description: string;
    'Cheque No': string;
    debit: number;
    credit: number;
    total: number;
    mappedCatItem?: CatItem[];
    type: 'CASH' | 'ONLINE';
};

export type MonthlySheetDataType = {
    Date: string;
    Desc: string;
    ChqNo: string;
    Amount: number;
    Balance: number;
    Type: 'CASH' | 'ONLINE';
};

export type CatItem = {
    key: string;
    value?: any;
    label: string;
    children?: CatItem[];
    mappedTrans?: Transaction[];
    amount?: number;
};
export type TransCatMapping = {
    mappedCatItem?: CatItem[];
    mappedTrans?: Transaction[];
    splitAmount?: number[];
};
export type AppData = {
    transactions: Transaction[];
    transactionFinYear: string;
    transCategories: CatItem[];
    transSheetMonth: string;
};

export type GoogleSheetConfig = {
    secret: string;
    SPREADSHEET_ID: string;
    ENC_CLIENT_EMAIL: string;
    ENC_PRIVATE_KEY: string;
    clientEmail?: string;
    privateKey?: string;
    doc: GoogleSpreadsheet;
    appData: AppData;
};
