import React from 'react'
import Multistep from 'react-multistep';

export default function OnlineTransactionParser() {
    const steps = [
        {name: 'StepOne', component: <div>step1</div>},
        {name: 'StepOne', component: <div>step1</div>},
      ];
    return (
        <>
            <Multistep showNavigation={true} steps={steps}/>
        </>
    );
}
