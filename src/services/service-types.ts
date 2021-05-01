import { GoogleSpreadsheet } from 'google-spreadsheet';

export type BankTransaction = {
    date: Date;
    desc: string;
    chqNo: string;
    withDrawal: number;
    deposit: number;
    balance: number;
};

export type catItem = {
    key: string;
    value?: any;
    label: string;
    children?: catItem[];
}

export type AppData = {
    transactions: BankTransaction[];
    transactionFinYear: string;
    transCategories: catItem[];
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
