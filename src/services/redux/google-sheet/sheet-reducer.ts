import { appConfig } from '../..';
import SHEET_ACTION_TYPES, { GoogleSheet } from './sheet-types';

const initialValue: GoogleSheet = {
    initError: '',
    sheetConfig: appConfig,
    sheetInfo: new Map(),
};
const sheetReducer = (state: GoogleSheet = initialValue, action: { type: SHEET_ACTION_TYPES, payload: any}) => {
    switch (action.type) {
    case SHEET_ACTION_TYPES.INIT:
        return {
            ...state,
            initializing: true,
        };
    case SHEET_ACTION_TYPES.INIT_SUCCESS:
        return {
            ...state,
            initializing: false,
            appConfig: action.payload,
        };
    case SHEET_ACTION_TYPES.INIT_FAILURE:
        return {
            ...state,
            initializing: false,
            initError: action.payload,
        };
    case SHEET_ACTION_TYPES.SET_SHEET_INFO:
        return {
            ...state,
            sheetInfo: action.payload,
        };
    default:
        return state;
    }
};

export default sheetReducer;
