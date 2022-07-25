import { Button, Radio } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ReactJson from 'react-json-view';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gsheetUtil from '../../services/googleapi';
import { initializeGoogleSheet } from '../../services/redux/google-sheet/sheet-actions';
import { GoogleSheet } from '../../services/redux/google-sheet/sheet-types';
import { doMonthlyCatSplit } from '../../services/redux/transactions/trans-actions';
import { TransData } from '../../services/redux/transactions/trans-types';
import SecretDialog from '../mapping/secret-dialog';
import CategorizeCash from './categorize-cash';
import CategorizeOnline from './categorize-online';

function Categorizer() {
    const [message, setMessage] = useState<string>();
    const [type, setType] = useState<'online' | 'cash' | undefined>('cash');
    const [secret, setSecret] = useState('');
    const dispatch = useDispatch();
    const sheetData: GoogleSheet = useSelector((state: any) => state.sheet);
    const { initError } = sheetData;
    const transData: TransData = useSelector((state: any) => state.trans);
    const { monthlyCatSplit, cashTransData, onlineTransData } = transData;
    useEffect(() => {
        if (secret) {
            dispatch(initializeGoogleSheet(secret) as any);
        }
    }, [dispatch, secret]);
    const splitMonthly = useCallback(() => {
        if (cashTransData && onlineTransData) {
            dispatch(doMonthlyCatSplit([...cashTransData, ...onlineTransData] as any, {}) as any);
            setType(undefined);
        }
    }, [cashTransData, dispatch, onlineTransData]);
    const saveCategorized = useCallback(() => {
        gsheetUtil.updateCategorySheet(monthlyCatSplit as any).then(() => {
            console.log('Saved');
            setMessage('Summary Updated');
        });
    }, [monthlyCatSplit]);
    return (
        <div>
            {!!message && <Alert severity="info">{message}</Alert> }
            {!!initError && <Alert severity="error">{initError}</Alert>}
            {!sheetData.sheetConfig.secret && (
                <SecretDialog errorMsg={initError} handleSecret={setSecret} />
            )}
            <h2>Categorize Transactions</h2>
            <div>
                <Radio
                    checked={type === 'cash'}
                    onChange={() => setType('cash')}
                    value="cash"
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'Cash' }}
                /> Cash &nbsp;&nbsp;&nbsp;
                <Radio
                    checked={type === 'online'}
                    onChange={() => setType('online')}
                    value="online"
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'Online' }}
                /> Online &nbsp;&nbsp;&nbsp;
                <Button
                    variant="outlined"
                    disabled={!cashTransData || !onlineTransData}
                    onClick={splitMonthly}
                >
                    Categorize Monthly
                </Button>&nbsp;&nbsp;&nbsp;
                <Button
                    variant="outlined"
                    disabled={!monthlyCatSplit}
                    onClick={saveCategorized}
                >
                    Save Categorized
                </Button>
            </div>
            {!initError && !!sheetData.sheetConfig.secret && (
                <>
                    {type === 'cash' && <CategorizeCash />}
                    {type === 'online' && <CategorizeOnline />}
                    {!type && !!monthlyCatSplit && <ReactJson src={monthlyCatSplit} />}
                </>
            )}
        </div>
    );
}

export default Categorizer;
