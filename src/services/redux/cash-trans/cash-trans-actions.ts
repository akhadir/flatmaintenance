import TransMapExecutor from '../../../utils/trans-map-executor';
import gsheetUtil from '../../googleapi';
import { CashTransType, CASH_TRANS_ACTIONS } from './cash-trans-types';

export const loadCashTransactions = () => ({
    type: CASH_TRANS_ACTIONS.LOAD_CASH_TRANS,
});

export const loadCashTransactionSuccess = (payload: any) => ({
    type: CASH_TRANS_ACTIONS.LOAD_CASH_TRANS_SUCCESS,
    payload,
});

export const loadCashTransactionFailure = (payload: any) => ({
    type: CASH_TRANS_ACTIONS.LOAD_CASH_TRANS_FAILURE,
    payload,
});

export function fetchCashTransactions() {
    return (dispatch: any) => {
        dispatch(loadCashTransactions());
        gsheetUtil.init().then(() => {
            gsheetUtil.getSheetByTitleAsJson('Cash Transactions').then((value) => {
                const transMapExec = new TransMapExecutor();
                transMapExec.run(value as CashTransType[]);
                dispatch(loadCashTransactionSuccess(value as any));
            }).catch((e: any) => {
                dispatch(loadCashTransactionFailure(e.message));
            });
        });
    };
}
