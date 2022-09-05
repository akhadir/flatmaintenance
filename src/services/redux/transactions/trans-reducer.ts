import { TransData, TransActions } from './trans-types';

const initValues: TransData = {
    loading: false,
    cashTransData: undefined,
    onlineTransData: undefined,
    monthlyCatSplit: undefined,
    error: '',
};

const transReducder = (state = initValues, action: { type: TransActions, payload: any}) => {
    switch (action.type) {
    case TransActions.LOAD_TRANS:
        return {
            ...state,
            loading: true,
        };
    case TransActions.LOAD_CASH_TRANS_SUCCESS:
        return {
            ...state,
            loading: false,
            cashTransData: action.payload as any,
            error: '',
        };
    case TransActions.LOAD_ONLINE_TRANS_SUCCESS:
        return {
            ...state,
            loading: false,
            onlineTransData: action.payload as any,
            error: '',
        };
    case TransActions.LOAD_CASH_TRANS_FAILURE:
        return {
            ...state,
            loading: false,
            cashTransData: undefined,
            error: action.payload as any,
        };
    case TransActions.LOAD_ONLINE_TRANS_FAILURE:
        return {
            ...state,
            loading: false,
            onlineTransData: undefined,
            error: action.payload as any,
        };
    case TransActions.UPDATE_MONTHLY_SPLIT:
        return {
            ...state,
            monthlyCatSplit: action.payload,
            loading: false,
        };
    case TransActions.RESET_MONTHLY_SPLIT:
        return {
            ...state,
            monthlyCatSplit: undefined,
        };
    case TransActions.UPDATE_MONTHLY_MAINT_SPLIT:
        return {
            ...state,
            monthlyMaintSplit: action.payload,
            loading: false,
        };
    case TransActions.RESET_MONTHLY_MAINT_SPLIT:
        return {
            ...state,
            monthlyMaintSplit: undefined,
        };
    case TransActions.RESET_TRANS:
        return initValues;
    default:
        return state;
    }
};

export default transReducder;
