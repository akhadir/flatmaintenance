import { BillsData, BillsActions } from './bills-types';

const initValues: BillsData = {
    isLoading: false,
    data: {},
    config: {
        listURL: 'https://state-tourniquet.000webhostapp.com/suraksha/telegram/get.php',
        fetchURL: '',
        updateURL: '',
    },
    layoutData: undefined,
};

const billsReducer = (state = initValues, action: { type: BillsActions, payload: any}): BillsData => {
    switch (action.type) {
    case BillsActions.INIT:
        return {
            ...state,
            isLoading: true,
            layoutData: action.payload,
        };
    case BillsActions.SUCCESS:
        return {
            ...state,
            isLoading: false,
            data: action.payload,
            error: undefined,
        };
    case BillsActions.FAILURE:
        return {
            ...state,
            isLoading: false,
            data: undefined,
            error: action.payload,
        };
    case BillsActions.SET_CONFIG:
        return {
            ...state,
            config: action.payload,
        };
    default:
        return state;
    }
};

export default billsReducer;
