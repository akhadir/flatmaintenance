import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FileUpload from '../file-upload';
import fileParserUtil from '../../services/xlsjs';
import FilePreview from '../file-preview';
import FileSave from '../file-save';
import { Transaction } from '../../services/service-types';
import { GoogleSheet } from '../../services/redux/google-sheet/sheet-types';
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
    return ['File Upload', 'File Preview', 'Save'];
}

export const OnlineTransactionParser = () => {
    const classes = useStyles();
    const { sheetConfig } : GoogleSheet = useSelector((state: any) => state.sheet);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [activeStep, setActiveStep] = useState(0);
    const [fileName, setFileName] = useState('');
    const [bankTransactions, setBankTransactions] = useState<Transaction[]>([]);
    const parseXLS = useCallback((file: File) => {
        setFileName(file.name);
        fileParserUtil.parseXLS(file).then((resp: Transaction[]) => {
            sheetConfig.appData.transactions = resp;
            setBankTransactions(resp);
            setErrorMsg('');
            setActiveStep(1);
        });
    }, [sheetConfig.appData]);
    const getStepContent = useCallback((step: number) => {
        switch (step) {
        case 0:
            return (<FileUpload onUpload={parseXLS} />);
        case 1:
            return (<FilePreview name={fileName} xlsData={bankTransactions} />);
        case 2:
            return (<FileSave />);
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
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
            setErrorMsg('');
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
    return (
        <div className="wizard">
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
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
                                    {(activeStep === steps.length - 1 && 'Save') || 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OnlineTransactionParser;
