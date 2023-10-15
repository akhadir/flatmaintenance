import React from 'react';
import Button from '@mui/material/Button';
import './index.css';
import { Stepper, Step, StepLabel } from '@mui/material';

export type WizardProps = {
    steps: string[];
    activeStep: number;
    children?: any;
    handleBack: () => void;
    handleNext: () => void;
};

function Wizard({
    steps, activeStep, children, handleBack, handleNext,
}: WizardProps) {
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
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
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
