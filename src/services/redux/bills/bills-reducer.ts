/* eslint-disable max-len */
import { BillsData, BillsActions } from './bills-types';

const initValues: BillsData = {
    isLoading: false,
    data: {},
    config: {
        encBotId: 'U2FsdGVkX1/0gDV/ibea6VfAgozs8tNyWPB0zt3iRLDsNORNjxOhmloQXZl7ywLjxeQl4Bmxe3iZ7RLdUxi+BA==',
        listURL: 'https://state-tourniquet.000webhostapp.com/suraksha/telegram/get.php',
        fetchURL: 'https://api.telegram.org/bot{{botId}}/getFile?file_id={{fileId}}',
        downloadURL: 'https://api.telegram.org/file/bot{{botId}}/photos/{{filePath}}',
        updateURL: 'https://state-tourniquet.000webhostapp.com/suraksha/telegram/processed.php?id={{recordId}}',
    },
    layoutData: undefined,
    events: [],
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
    case BillsActions.ADD_EVENTS:
        return {
            ...state,
            events: [...state.events, action.payload],
        };
    default:
        return state;
    }
};

export default billsReducer;
