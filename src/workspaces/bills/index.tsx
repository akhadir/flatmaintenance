import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { billsInit } from '../../services/redux/bills/bills-action';
import LayoutRenderer from '../../lib/layout';
import layout from './layout';
import fetchFiles from '../../services/googleapis/drive-util';

fetchFiles();

const Bills: React.FC = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(billsInit(layout as any));
    }, [dispatch]);
    return (
        <LayoutRenderer layout={layout} />
    );
};

export default Bills;
