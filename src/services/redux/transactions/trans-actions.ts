import moment from 'moment';
import TransMapExecutor from '../../../utils/trans-map-executor';
import gsheetUtil from '../../googleapis';
import catMapJson from '../../cat-map/cat-map';
import maintMapJson from '../../maint-map/maint-map';
import { TransactionType, TransActions, MonthlyCatSplit, MonthlyMaintSplit } from './trans-types';
import MaintMapExecutor from '../../../utils/maint-map-executor';
import { TransCategory } from '../../../utils/trans-category';

export const loadTransactions = () => ({
    type: TransActions.LOAD_TRANS,
});

export const loadCashTransactionSuccess = (payload: any) => ({
    type: TransActions.LOAD_CASH_TRANS_SUCCESS,
    payload,
});

export const loadOnlineTransactionSuccess = (payload: any) => ({
    type: TransActions.LOAD_ONLINE_TRANS_SUCCESS,
    payload,
});

export const loadCashTransactionFailure = (payload: any) => ({
    type: TransActions.LOAD_CASH_TRANS_FAILURE,
    payload,
});

export const loadOnlineTransactionFailure = (payload: any) => ({
    type: TransActions.LOAD_ONLINE_TRANS_FAILURE,
    payload,
});

export const updateMonthlySplit = (payload: any) => ({
    type: TransActions.UPDATE_MONTHLY_SPLIT,
    payload,
});

export const resetMonthlyCatSplit = () => ({
    type: TransActions.RESET_MONTHLY_SPLIT,
});

export const updateMonthlyMaintenanceSplit = (payload: any) => ({
    type: TransActions.UPDATE_MONTHLY_MAINT_SPLIT,
    payload,
});

export const resetMonthlyMaintenanceCatSplit = () => ({
    type: TransActions.RESET_MONTHLY_MAINT_SPLIT,
});

export const resetTransaction = () => ({
    type: TransActions.RESET_TRANS,
});

export function filterTransactions(transactions: TransactionType[], filter: TransCategory[]) {
    return transactions.filter((trans) => trans.Category && filter.indexOf(trans.Category) > -1);
}

export function fetchTransactions(sheetName = 'Cash Transactions') {
    return (dispatch: any) => {
        dispatch(loadTransactions());
        gsheetUtil.init().then(() => {
            gsheetUtil.getSheetByTitleAsJson(sheetName).then((value) => {
                const transMapExec = new TransMapExecutor(catMapJson as any);
                transMapExec.run(value as TransactionType[]);
                const maintMapExecutor = new MaintMapExecutor(maintMapJson as any);
                maintMapExecutor.run(filterTransactions(
                    value as TransactionType[],
                    [
                        TransCategory['Maintenance Collection'],
                        TransCategory['Corpus Fund'],
                    ]));
                dispatch(loadCashTransactionSuccess(value as any));
                gsheetUtil.saveSheetWithJSON(value);
            }).catch((e: any) => {
                dispatch(loadCashTransactionFailure(e.message));
            });
        });
    };
}

export function fetchOnlineTransactions(sheetName = 'Online Transactions') {
    return (dispatch: any) => {
        dispatch(loadTransactions());
        gsheetUtil.init().then(() => {
            gsheetUtil.getSheetByTitleAsJson(sheetName).then((value) => {
                const transMapExec = new TransMapExecutor(catMapJson as any);
                transMapExec.run(value as TransactionType[]);
                const maintMapExecutor = new MaintMapExecutor(maintMapJson as any);
                maintMapExecutor.run(filterTransactions(
                    value as TransactionType[],
                    [
                        TransCategory['Maintenance Collection'],
                        TransCategory['Corpus Fund'],
                    ]));
                dispatch(loadOnlineTransactionSuccess(value as any));
                gsheetUtil.saveSheetWithJSON(value);
            }).catch((e: any) => {
                dispatch(loadOnlineTransactionFailure(e.message));
            });
        });
    };
}

export function doMonthlyCatSplit(data: TransactionType[], monthlySplit: MonthlyCatSplit) {
    return (dispatch: any) => {
        dispatch(loadTransactions());
        data.forEach((datum: TransactionType) => {
            const cat = datum.Category;
            const date = datum.Date;
            if (cat && date) {
                const replacedDate = date.replace(/\//g, '-');
                const month = moment(replacedDate, 'DD-MM-YYYY').format('MMM-YY');
                if (!monthlySplit) {
                    monthlySplit = {};
                }
                if (!monthlySplit[month]) {
                    monthlySplit[month] = {};
                }
                const isDebit = datum.Debit && datum.Debit?.toString() !== '0';
                let amount = isDebit ?
                    parseFloat(datum.Debit!.toString().replace(/,/g, '')) :
                    parseFloat(datum.Credit!.toString().replace(/,/g, ''));
                if (isDebit) {
                    amount = -amount;
                }
                if (amount && typeof amount === 'number') {
                    if (!monthlySplit[month][cat]) {
                        monthlySplit[month][cat] = amount;
                    } else {
                        monthlySplit[month][cat] += amount;
                    }
                } else {
                    console.log('cat', cat, month, datum);
                }
            }
        });
        dispatch(updateMonthlySplit({ ...monthlySplit }));
    };
}

export function doMonthlyMaintSplit(data: TransactionType[], monthlySplit: MonthlyMaintSplit) {
    return (dispatch: any) => {
        dispatch(loadTransactions());
        data.forEach((datum: TransactionType) => {
            const flat = datum.Flat;
            const date = datum.Date;
            if (flat && date) {
                const month = moment(date, 'DD/MM/YYYY').format('MMM-YY');
                if (!monthlySplit) {
                    monthlySplit = {};
                }
                if (!monthlySplit[month]) {
                    monthlySplit[month] = {};
                }
                const amount = parseFloat(datum.Credit!.toString().replace(/,/g, ''));
                if (amount && typeof amount === 'number') {
                    if (!monthlySplit[month][flat]) {
                        monthlySplit[month][flat] = amount;
                    } else {
                        monthlySplit[month][flat] += amount;
                    }
                } else {
                    console.log('Flat', flat, month, datum);
                }
            }
        });
        dispatch(updateMonthlyMaintenanceSplit({ ...monthlySplit }));
    };
}
