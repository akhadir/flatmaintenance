import { sheetConfig, setCredentials } from '../..';
import { GoogleSheetConfig } from '../../service-types';
import SHEET_ACTION_TYPES, { SheetInfo } from './sheet-types';

export const initSheet = () => ({
    type: SHEET_ACTION_TYPES.INIT,
});

export const initSuccess = (payload: GoogleSheetConfig) => ({
    type: SHEET_ACTION_TYPES.INIT_SUCCESS,
    payload,
});

export const initFailure = (payload: string) => ({
    type: SHEET_ACTION_TYPES.INIT_FAILURE,
    payload,
});

export const setSheetInfo = (payload: SheetInfo) => ({
    type: SHEET_ACTION_TYPES.SET_SHEET_INFO,
    payload,
});

export function initializeGoogleSheet(secret: string) {
    return (dispatch: any) => {
        dispatch(initSheet());
        const out = setCredentials(secret);
        if (out.res) {
            dispatch(initSuccess({ ...sheetConfig }));
        } else {
            dispatch(initFailure(out.error));
        }
    };
}
