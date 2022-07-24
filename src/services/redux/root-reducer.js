import { combineReducers } from 'redux';
import cashTransReducder from './cash-trans/cash-trans-reducer';
import sheetReducer from './google-sheet/sheet-reducer';

const rootReducer = combineReducers({
    sheet: sheetReducer,
    cash: cashTransReducder,
});

export default rootReducer;
