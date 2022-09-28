import {
    Button, Step, StepLabel, Stepper, Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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
import './categorizer.css';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        button: {
            marginRight: theme.spacing(1),
        },
        instructions: {
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
        },
    }),
);

function Categorizer() {
    const [message, setMessage] = useState<string>();
    const [type, setType] = useState<'online' | 'cash' | 'monthly' | undefined>('cash');
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
    const steps = useMemo(() => (
        ['Cash Transactions', 'Online Transactions', 'Map Transactions', 'Categorize Maintenance']), []);
    const isStepOptional = useCallback((index: number) => false, []);
    const isCompletedStep = useCallback((index: number) => false, []);
    const classes = useStyles();
    const handleBack = useCallback(() => {
        switch (activeStep) {
        case 3: {
            setType(undefined);
            setActiveStep(2);
            break;
        }
        case 2: {
            setType('online');
            setActiveStep(1);
            break;
        }
        case 1: {
            setType('cash');
            setActiveStep(0);
            break;
        }
        default:
            // Nothing to be done
        }
    }, [activeStep]);
    const handleSkip = useCallback(() => {}, []);
    const handleNext = useCallback(() => {
        switch (activeStep) {
        case 0: {
            setType('online');
            setActiveStep(1);
            break;
        }
        case 1: {
            setType(undefined);
            setActiveStep(2);
            splitMonthly();
            break;
        }
        case 2: {
            setType(undefined);
            setActiveStep(3);
            splitMonthlyMaintenance();
            break;
        }
        default:
            // Nothing to be done
        }
    }, [activeStep, splitMonthlyMaintenance, splitMonthly]);
    return (
        <div>
            {!!message && <Alert severity="info">{message}</Alert> }
            {!!initError && <Alert severity="error">{initError}</Alert>}
            <div className="stepper-header">
                <Stepper className="steps" activeStep={activeStep}>
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
                <div className="nav">
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                    >
                        Back
                    </Button>
                    {isStepOptional(activeStep) && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSkip}
                            className={classes.button}
                        >
                            Skip
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                    >
                        {(activeStep === steps.length - 1 && 'Save') || 'Next'}
                    </Button>
                </div>
            </div>
            <div className="control">
                {activeStep === 2 && (
                    <Button
                        variant="outlined"
                        disabled={!monthlyCatSplit}
                        onClick={saveCategorized}
                    >
                        Save Categorized
                    </Button>
                )}&nbsp;&nbsp;&nbsp;
                {activeStep === 3 && (
                    <Button
                        variant="outlined"
                        disabled={!monthlyMaintSplit}
                        onClick={saveMaitenenceSplit}
                    >
                        Save Split
                    </Button>
                )}
            </div>
            {!initError && !!sheetData.sheetConfig.secret && (
                <>
                    {activeStep === 0 && <CategorizeCash />}
                    {activeStep === 1 && <CategorizeOnline />}
                    {activeStep === 2 && !!monthlyCatSplit && <ReactJson src={monthlyCatSplit} />}
                    {activeStep === 3 && !!monthlyMaintSplit && <ReactJson src={monthlyMaintSplit} />}
                </>
            )}
        </div>
    );
}

export default Categorizer;
