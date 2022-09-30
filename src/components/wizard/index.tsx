import React, { useCallback, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@mui/material/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import './index.css';

export type WizardProps = {
    steps: string[];
    isStepOptional: boolean[];
    children?: any;
};

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

function Wizard({ steps, isStepOptional, children }: WizardProps) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState<number>(0);
    const handleBack = useCallback(() => {
        setActiveStep((step) => step - 1);
    }, []);
    const handleNext = useCallback(() => {
        setActiveStep((step) => step + 1);
    }, []);
    const handleSkip = useCallback(() => {
        setActiveStep((step) => step + 1);
    }, []);
    return (
        <div className="wizard">
            <div className="stepper-header">
                <Stepper className="steps" activeStep={activeStep}>
                    {steps.map((label: string) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <div className="stepper-nav">
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                    >
                        Back
                    </Button>
                    {isStepOptional[activeStep] && (
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
            <div className="content">{children}</div>
        </div>
    );
}

export default Wizard;
