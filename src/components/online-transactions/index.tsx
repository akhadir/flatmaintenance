import React, { useCallback, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import FileUpload from '../file-upload';
import fileParserUtil from '../../services/xlsjs';
import FilePreview from '../file-preview';
import Mapping from '../mapping';
import AppContext, { sheetConfig, setCredentials } from '../../services';
import SecretDialog from '../mapping/secret-dialog';
import transSheet from '../../services/sheet';
import { Transaction } from '../../services/service-types';
import './index.css';

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

function getSteps() {
    return ['File Upload', 'File Preview', 'Transaction Mapping'];
}

export const OnlineTransactionParser = () => {
    const classes = useStyles();
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [activeStep, setActiveStep] = useState(0);
    const [fileName, setFileName] = useState('');
    const [secret, setSecret] = useState('');
    const [bankTransactions, setBankTransactions] = useState<Transaction[]>([]);
    const parseXLS = useCallback((file: File) => {
        setFileName(file.name);
        fileParserUtil.parseXLS(file).then((resp: Transaction[]) => {
            sheetConfig.appData.transactions = resp;
            setBankTransactions(resp);
            setErrorMsg('');
            setActiveStep(1);
        });
    }, []);
    const getStepContent = useCallback((step: number) => {
        switch (step) {
        case 0:
            return (<FileUpload onUpload={parseXLS} />);
        case 1:
            return (<FilePreview name={fileName} xlsData={bankTransactions} />);
        case 2:
            return (<Mapping xlsData={bankTransactions} />);
        default:
            return 'Unknown step';
        }
    }, [bankTransactions, parseXLS, fileName]);
    const [skipped, setSkipped] = useState(new Set<number>());
    const steps = getSteps();

    const isStepOptional = (step: number) => false;

    const isStepSkipped = useCallback((step: number) => skipped.has(step), [skipped]);

    const handleNext = useCallback(async () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }
        switch (activeStep) {
        case 0: {
            if (fileName) {
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setErrorMsg('');
            } else {
                setErrorMsg('Select a file.');
            }
            break;
        }
        case 1: {
            const monthSheet = sheetConfig.appData.transSheetMonth;
            if (monthSheet) {
                await transSheet.setMonthData(monthSheet).then((result) => {
                    if (result) {
                        console.log('Month Created');
                    }
                });
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setErrorMsg('');
            } else {
                setErrorMsg('Select a month to proceed.');
            }
            break;
        }
        default:
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setErrorMsg('');
        }
        setSkipped(newSkipped);
    }, [activeStep, fileName, isStepSkipped, skipped]);

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };
    const handleReset = useCallback(() => {
        setActiveStep(0);
    }, []);
    useEffect(() => {
        if (secret) {
            if (!setCredentials(secret)) {
                setErrorMsg('Wrong secret. Enter it again.');
                setSecret('');
            } else {
                setErrorMsg('');
            }
        }
    }, [secret]);
    return (
        <>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            {!sheetConfig.secret ? (
                <SecretDialog errorMsg={errorMsg} handleSecret={setSecret} />
            ) : (
                <AppContext.Provider value={sheetConfig}>
                    <div className="wizard">
                        <div className={classes.root}>
                            <Stepper activeStep={activeStep}>
                                {steps.map((label, index) => {
                                    const stepProps: { completed?: boolean } = {};
                                    const labelProps: { optional?: React.ReactNode } = {};
                                    if (isStepOptional(index)) {
                                        labelProps.optional = <Typography variant="caption">Optional</Typography>;
                                    }
                                    if (isStepSkipped(index)) {
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
                                {activeStep === steps.length && (
                                    <div>
                                        <Typography className={classes.instructions}>
                                            All steps completed - you&apos;re finished
                                        </Typography>
                                        <Button onClick={handleReset} className={classes.button}>
                                            Reset
                                        </Button>
                                    </div>
                                )}
                                {activeStep !== steps.length && (
                                    <div>
                                        <Typography className={classes.instructions}>
                                            {getStepContent(activeStep)}
                                        </Typography>
                                        <div>
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
                                                {(activeStep === steps.length - 1 && 'Finish') || 'Next'}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </AppContext.Provider>
            )}
        </>
    );
};

export default OnlineTransactionParser;
