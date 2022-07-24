import { CashTransData, CASH_TRANS_ACTIONS } from './cash-trans-types';

const initValues: CashTransData = {
    loading: false,
    data: undefined,
    error: '',
};

const cashTransReducder = (state = initValues, action: { type: CASH_TRANS_ACTIONS, payload: any}) => {
    switch (action.type) {
    case CASH_TRANS_ACTIONS.LOAD_CASH_TRANS:
        return {
            ...state,
            loading: true,
        };
    case CASH_TRANS_ACTIONS.LOAD_CASH_TRANS_SUCCESS:
        return {
            ...state,
            loading: false,
            data: action.payload as any,
            error: '',
        };
    case CASH_TRANS_ACTIONS.LOAD_CASH_TRANS_FAILURE:
        return {
            ...state,
            loading: false,
            data: undefined,
            error: action.payload as any,
        };
    default:
        return state;
    }
};

export default cashTransReducder;
