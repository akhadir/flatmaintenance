import React, { useCallback, useState } from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@mui/material/Button';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import './index.css';

export type WizardProps = {
    steps: string[];
    activeStep: number;
    children?: any;
    handleBack: () => void;
    handleNext: () => void;
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

function Wizard({
    steps, activeStep, children, handleBack, handleNext,
}: WizardProps) {
    const classes = useStyles();
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
