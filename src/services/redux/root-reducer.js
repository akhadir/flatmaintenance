import { combineReducers } from 'redux';
import transReducder from './transactions/trans-reducer';
import sheetReducer from './google-sheet/sheet-reducer';

const rootReducer = combineReducers({
    sheet: sheetReducer,
    trans: transReducder,
});

export default rootReducer;
