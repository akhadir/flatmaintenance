import moment from 'moment';
import TransMapExecutor from '../../../utils/trans-map-executor';
import gsheetUtil from '../../googleapi';
import catMapJson from '../../cat-map/cat-map';
import { TransactionType, TransActions, MonthlyCatSplit } from './trans-types';

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

export const resetTransaction = () => ({
    type: TransActions.RESET_TRANS,
});

export function fetchTransactions(sheetName = 'Cash Transactions') {
    return (dispatch: any) => {
        dispatch(loadTransactions());
        gsheetUtil.init().then(() => {
            gsheetUtil.getSheetByTitleAsJson(sheetName).then((value) => {
                const transMapExec = new TransMapExecutor(catMapJson as any);
                transMapExec.run(value as TransactionType[]);
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
                const month = moment(date, 'DD/MM/YYYY').format('MMM-YY');
                if (!monthlySplit) {
                    monthlySplit = {};
                }
                if (!monthlySplit[month]) {
                    monthlySplit[month] = {};
                }
                const isDebit = datum.Debit && datum.Debit?.toString() !== '0';
                let amount = isDebit ?
                    parseInt(datum.Debit!.toString(), 10) :
                    parseInt(datum.Credit!.toString(), 10);
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
