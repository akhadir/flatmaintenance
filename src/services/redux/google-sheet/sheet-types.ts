import { ApplicationConfig } from '../../service-types';

enum SHEET_ACTION_TYPES {
    INIT = 'INIT',
    INIT_SUCCESS = 'GET_SHEET_INFO',
    INIT_FAILURE = 'GET_SHEET_INFO_FAILURE',
    SET_SHEET_INFO = 'SET_SHEET_INFO',
}

export type SheetInfo = Map<string, { [key: string]: any }[]>;

export type GoogleSheet = {
    initializing?: boolean;
    initError: string;
    sheetConfig: ApplicationConfig;
    sheetInfo: SheetInfo;
};

export default SHEET_ACTION_TYPES;
