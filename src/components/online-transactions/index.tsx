import React, { useCallback, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FileUpload from '../file-upload';
import fileParserUtil, { BankTransaction } from './file-parser-util';
import './index.css';
import FilePreview from '../file-preview';

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
    const [activeStep, setActiveStep] = useState(0);
    const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
    const parseXLS = useCallback((file: File) => {
        fileParserUtil.parseXLS(file).then((resp: BankTransaction[]) => {
            setBankTransactions(resp);
            setActiveStep(1);
        });
    }, []);
    const getStepContent = useCallback((step: number) => {
        switch (step) {
        case 0:
            return (<FileUpload onUpload={parseXLS} />);
        case 1:
            return (<FilePreview xlsData={bankTransactions} />);
        case 2:
            return 'Mapping comes here';
        default:
            return 'Unknown step';
        }
    }, [bankTransactions, parseXLS]);
    const [skipped, setSkipped] = React.useState(new Set<number>());
    const steps = getSteps();

    const isStepOptional = (step: number) => false;

    const isStepSkipped = (step: number) => skipped.has(step);

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

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

    const handleReset = () => {
        setActiveStep(0);
    };
    return (
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
                    {activeStep === steps.length ? (
                        <div>
                            <Typography className={classes.instructions}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Button onClick={handleReset} className={classes.button}>
                                Reset
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
                            <div>
                                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
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
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
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
