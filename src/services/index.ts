import { GoogleSpreadsheet } from 'google-spreadsheet';
import React from 'react';
import CryptoJS from 'crypto-js';
import moment from 'moment';
import { AppConfig, AppData, CatItem } from './service-types';

export const setCredentials = (secret: string = '') => {
    let out = false;
    if (secret) {
        const emailB = CryptoJS.AES.decrypt(appConfig.ENC_CLIENT_EMAIL, secret);
        const pkB = CryptoJS.AES.decrypt(appConfig.ENC_PRIVATE_KEY, secret);
        try {
            appConfig.clientEmail = emailB.toString(CryptoJS.enc.Utf8);
            appConfig.privateKey = pkB.toString(CryptoJS.enc.Utf8);
            appConfig.secret = secret;
            sessionStorage.setItem('session-id', secret);
            out = true;
        } catch (e) {
            appConfig.secret = '';
            out = false;
        }
    } else {
        appConfig.secret = '';
        out = false;
    }
    return out;
};
const flatNumbers = [
    '001', '002', '003', '004', '005', '007', '008', '009', '010', '011', '012',
    '101', '102', '103', '104', '105', '106', '107', '108', '109', '110', '111', '112',
    '201', '202', '203', '204', '205', '206', '207', '208', '209', '210', '211', '212',
    '301', '302', '303', '304', '305', '306', '307', '308', '309', '310', '311', '312',
    '401', '402', '403', '404', '405', '406', '407', '408', '409', '410', '411', '412',
];

const transCategories: CatItem[] = [
    {
        key: 'maintenance',
        label: 'Maintenance',
        children: flatNumbers.map((val) => ({
            key: val,
            label: val,
        })),
    },
    {
        key: 'corpus',
        label: 'Corpus Fund',
        children: flatNumbers.map((val) => ({
            key: val,
            label: val,
        })),
    },
    {
        key: 'monthly',
        label: 'Monthly Expenses',
        children: [],
    },
];

const appData: AppData = {
    transCategories,
    transactionFinYear: moment().format('YYYY'),
    transactions: [],
};

export const appConfig: AppConfig = {
    secret: sessionStorage.getItem('session-id') || '',
    SPREADSHEET_ID: '1DkvPBSTUHJB9nnd31pfR7-n-71e4OtV5jHs2LHaWcKM',
    // eslint-disable-next-line max-len
    ENC_CLIENT_EMAIL: 'U2FsdGVkX19lrOkAqkI1YRZkdHSjXZc+dtJNUzOhSlqaydB6Gxi4lm9MpS7+2/W7OtInfOCmh739buu1z1jzT/jJrAeRX2+hKkxc+3qsduw=',
    // eslint-disable-next-line max-len
    ENC_PRIVATE_KEY: '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',
    doc: new GoogleSpreadsheet('1DkvPBSTUHJB9nnd31pfR7-n-71e4OtV5jHs2LHaWcKM'),
    appData,
};

if (appConfig.secret) {
    setCredentials(appConfig.secret);
}
const AppContext = React.createContext(appConfig);

// eslint-disable-next-line no-shadow
export enum TransactionFilters {
    all = 'All Transaction',
    mapped = 'Only Mapped',
    unmapped = 'Only Unmapped',
}

export default AppContext;
