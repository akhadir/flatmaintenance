import axios from 'axios';
import { LayoutType } from '../../../lib/layout/layout-types';
import { BillsActions, BillsConfig, BillsData } from './bills-types';

export const billsInit = (payload: LayoutType) => ({
    type: BillsActions.INIT,
    payload,
});

export const billsSuccess = (payload: any) => ({
    type: BillsActions.SUCCESS,
    payload,
});

export const billsFailure = (payload: any) => ({
    type: BillsActions.FAILURE,
    payload,
});

export const setConfig = (payload: BillsConfig) => ({
    type: BillsActions.SET_CONFIG,
    payload,
});

export const fetch = (layoutData: LayoutType) => (dispatch: any, getState: any) => {
    dispatch(billsInit(layoutData));
    const { config }: BillsData = getState((state: any) => state.bills);
    axios.get(config.listURL).then((res) => {
        dispatch(billsSuccess(res.data.messages));
    }).catch((e) => {
        dispatch(billsFailure(e));
    });
};
