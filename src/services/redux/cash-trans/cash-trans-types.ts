import { TransCategory } from '../../../utils/trans-category';

export enum CASH_TRANS_ACTIONS {
    LOAD_CASH_TRANS = 'LOAD_CASH_TRANS',
    LOAD_CASH_TRANS_SUCCESS = 'LOAD_CASH_TRANS_SUCCESS',
    LOAD_CASH_TRANS_FAILURE = 'LOAD_CASH_TRANS_FAILURE',
}

export type CashTransData = {
    loading: boolean;
    data?: { [type: string]: any }[];
    error: string;
}

export type CashTransType = {
    Date: string | null;
    Description: string;
    Debit: number | null;
    Credit: number | null;
    Total: number;
    Category?: TransCategory;
};
