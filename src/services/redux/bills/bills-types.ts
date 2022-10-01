import { LayoutType } from '../../../lib/layout/layout-types';

export enum BillsActions {
    INIT = 'INIT',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    SET_CONFIG = 'SET_CONFIG',
}

export type BillsConfig = {
    listURL: string;
    fetchURL: string;
    updateURL: string;
};

export type BillsData = {
    isLoading: boolean;
    data: any;
    config: BillsConfig;
    layoutData?: LayoutType;
    error?: any;
};
