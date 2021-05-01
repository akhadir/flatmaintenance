import { GoogleSpreadsheet } from 'google-spreadsheet';

export type Transaction = {
    date: Date;
    desc: string;
    chqNo: string;
    withDrawal: number;
    deposit: number;
    balance: number;
    mappedCatItem?: CatItem[];
    type: 'CASH' | 'ONLINE';
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
};

export type AppConfig = {
    secret: string;
    SPREADSHEET_ID: string;
    ENC_CLIENT_EMAIL: string;
    ENC_PRIVATE_KEY: string;
    clientEmail?: string;
    privateKey?: string;
    doc: GoogleSpreadsheet;
    appData: AppData;
};
