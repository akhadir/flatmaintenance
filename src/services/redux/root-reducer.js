import { combineReducers } from 'redux';
import transReducder from './transactions/trans-reducer';
import sheetReducer from './google-sheet/sheet-reducer';
import billsReducer from './bills/bills-reducer';

const rootReducer = combineReducers({
    sheet: sheetReducer,
    trans: transReducder,
    bills: billsReducer,
});

export default rootReducer;
