import { Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeGoogleSheet } from '../../services/redux/google-sheet/sheet-actions';
import SecretDialog from '../mapping/secret-dialog';
import CategorizeCash from './categorize-cash';

function Categorizer() {
    const [type, setType] = useState<'online' | 'cash' | undefined>();
    const [secret, setSecret] = useState('');
    const dispatch = useDispatch();
    const sheetData = useSelector((state: any) => state.sheet);
    const errorMsg = useMemo(() => sheetData.initError, [sheetData]);
    useEffect(() => {
        if (secret) {
            dispatch(initializeGoogleSheet(secret) as any);
        }
    }, [dispatch, secret]);
    return (
        <div>
            {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            {!sheetData.sheetConfig.secret && (
                <SecretDialog errorMsg={errorMsg} handleSecret={setSecret} />
            )}
            <h2>Categorize Transactions</h2>
            {!type && (
                <>
                    <Button variant="outlined" onClick={() => setType('cash')}>Cash</Button>&nbsp;
                    <Button variant="outlined" onClick={() => setType('online')}>Online</Button>
                </>
            )}
            {!!type && <CategorizeCash />}
        </div>
    );
}

export default Categorizer;
