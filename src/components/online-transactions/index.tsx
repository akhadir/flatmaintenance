import React from 'react';
import Multistep from 'react-multistep';
import FileUpload from '../file-upload';
import './index.css';

export const OnlineTransactionParser = () => {
    const steps = [
        { name: 'File Upload', component: <FileUpload /> },
        { name: 'File Preview', component: <div>step2</div> },
        { name: 'Transaction Mapping', component: <div>step1</div> },
    ];
    return (
        <div className="wizard">
            <Multistep showNavigation steps={steps} />
        </div>
    );
};

export default OnlineTransactionParser;
