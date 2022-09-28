import {
    Button, Radio, Step, StepLabel, Stepper, Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import ReactJson from 'react-json-view';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import gsheetUtil from '../../services/googleapi';
import { initializeGoogleSheet } from '../../services/redux/google-sheet/sheet-actions';
import { GoogleSheet } from '../../services/redux/google-sheet/sheet-types';
import {
    doMonthlyCatSplit,
    doMonthlyMaintSplit,
    filterTransactions,
} from '../../services/redux/transactions/trans-actions';
import { TransactionType, TransData } from '../../services/redux/transactions/trans-types';
import CategorizeCash from './categorize-cash';
import CategorizeOnline from './categorize-online';
import { TransCategory } from '../../utils/trans-category';

function Categorizer() {
    const [message, setMessage] = useState<string>();
    const [type, setType] = useState<'online' | 'cash' | undefined>('cash');
    const [secret, setSecret] = useState('');
    const dispatch = useDispatch();
    const sheetData: GoogleSheet = useSelector((state: any) => state.sheet);
    const { initError } = sheetData;
    const transData: TransData = useSelector((state: any) => state.trans);
    const { monthlyCatSplit, cashTransData, onlineTransData, monthlyMaintSplit } = transData;
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
    const splitMonthlyMaintenance = useCallback(() => {
        if (cashTransData && onlineTransData) {
            const filteredTransData: TransactionType[] = filterTransactions(
                [...cashTransData as TransactionType[], ...onlineTransData as TransactionType[]],
                [
                    TransCategory['Maintenance Collection'],
                ],
            );
            dispatch(doMonthlyMaintSplit(filteredTransData as any, {}) as any);
            setType(undefined);
        }
    }, [cashTransData, dispatch, onlineTransData]);
    const saveCategorized = useCallback(() => {
        gsheetUtil.updateCategorySheet(monthlyCatSplit as any).then(() => {
            console.log('Saved');
            setMessage('Summary Updated');
        });
    }, [monthlyCatSplit]);
    const saveMaitenenceSplit = useCallback(() => {
        gsheetUtil.udpateMaintenanceSheet(monthlyMaintSplit as any).then(() => {
            console.log('Saved');
            setMessage('Maintenence Split Updated');
        });
    }, [monthlyMaintSplit]);
    const [activeStep, setActiveStep] = useState(0);
    const steps = useMemo(() => (['Cash Transactions', 'Online Transactions', 'Calculated Mappings']), []);
    const isStepOptional = useCallback((index: number) => false, []);
    const isCompletedStep = useCallback((index: number) => false, []);
    return (
        <div>
            {!!message && <Alert severity="info">{message}</Alert> }
            {!!initError && <Alert severity="error">{initError}</Alert>}
            <h2>Categorize Transactions</h2>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                    }
                    if (isCompletedStep(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
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
                    Categorize Transactions Monthly
                </Button>&nbsp;&nbsp;&nbsp;
                <Button
                    variant="outlined"
                    disabled={!monthlyCatSplit}
                    onClick={saveCategorized}
                >
                    Save Categorized Transactions
                </Button>&nbsp;&nbsp;&nbsp;
                <Button
                    variant="outlined"
                    disabled={!cashTransData || !onlineTransData}
                    onClick={splitMonthlyMaintenance}
                >
                    Categorize Maintenance Monthly
                </Button>&nbsp;&nbsp;&nbsp;
                <Button
                    variant="outlined"
                    disabled={!monthlyMaintSplit}
                    onClick={saveMaitenenceSplit}
                >
                    Save Categorized Maintenance
                </Button>
            </div>
            {!initError && !!sheetData.sheetConfig.secret && (
                <>
                    {type === 'cash' && <CategorizeCash />}
                    {type === 'online' && <CategorizeOnline />}
                    {!type && !!monthlyMaintSplit && <ReactJson src={monthlyMaintSplit} />}
                    {!type && !!monthlyCatSplit && <ReactJson src={monthlyCatSplit} />}
                </>
            )}
        </div>
    );
}

export default Categorizer;
