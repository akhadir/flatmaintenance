import { FlatCategory } from '../../../utils/flat-category';
import { TransCategory } from '../../../utils/trans-category';

export enum TransActions {
    LOAD_TRANS = 'LOAD_TRANS',
    LOAD_CASH_TRANS_SUCCESS = 'LOAD_CASH_TRANS_SUCCESS',
    LOAD_ONLINE_TRANS_SUCCESS = 'LOAD_ONLINE_TRANS_SUCCESS',
    LOAD_CASH_TRANS_FAILURE = 'LOAD_CASH_TRANS_FAILURE',
    LOAD_ONLINE_TRANS_FAILURE = 'LOAD_ONLINE_TRANS_FAILURE',
    UPDATE_MONTHLY_SPLIT = 'UPDATE_MONTHLY_SPLIT',
    RESET_MONTHLY_SPLIT = 'RESET_MONTHLY_SPLIT',
    UPDATE_MONTHLY_MAINT_SPLIT = 'UPDATE_MONTHLY_MAINT_SPLIT',
    RESET_MONTHLY_MAINT_SPLIT = 'RESET_MONTHLY_MAINT_SPLIT',
    RESET_TRANS = 'RESET_TRANS',
}
export type MonthlyCatSplit = {
    [month: string]: {
        [category: string]: number;
    };
};

export type MonthlyMaintSplit = {
    [month: string]: {
        [category: string]: number;
    };
};
export type TransData = {
    loading: boolean;
    cashTransData?: { [type: string]: any }[];
    onlineTransData?: { [type: string]: any }[];
    monthlyCatSplit?: MonthlyCatSplit;
    monthlyMaintSplit?: MonthlyMaintSplit;
    error: string;
}

export type TransactionType = {
    Date: string | null;
    Description: string;
    'Cheque No'?: string | null;
    Debit: number | null;
    Credit: number | null;
    Total: number;
    Category?: TransCategory;
    Flat?: FlatCategory;
};
