import { LayoutType } from '../../../lib/layout/layout-types';

export enum BillsActions {
    INIT = 'INIT',
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    SET_CONFIG = 'SET_CONFIG',
    ADD_EVENTS = 'ADD_EVENTS',
}

export type BillsConfig = {
    listURL: string;
    fetchURL: string;
    downloadURL: string;
    updateURL: string;
};

export type BillEventType = 'wizard:next' | 'wizard:back' | 'field:blur';

export type BillEvent = {
    id: string;
    type: BillEventType;
    layout: LayoutType;
    state?: 'pending' | 'processing' | 'processed',
    payload?: any;
}
export type BillsData = {
    isLoading: boolean;
    data: any;
    config: BillsConfig;
    layoutData?: LayoutType;
    error?: any;
    events: BillEvent[];
};
