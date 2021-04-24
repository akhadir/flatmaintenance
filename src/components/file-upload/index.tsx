import React, { useCallback } from 'react';
import { FilePicker } from 'react-file-picker';
import './index.css';

export const FileUpload = () => {
    const onUpload = useCallback((fileObject) => {
        console.log(fileObject);
        
    }, []);
    const onError = useCallback((errMsg) => {
        console.log(errMsg);
    }, []);
    return (
        <>
            <p>Upload a transaction file (.xls) to process.</p>
            <div className="file-upload-wrapper">
                <FilePicker
                    extensions={['xls', '.xlsx']}
                    onChange={onUpload}
                    onError={onError}
                >
                    <button type="button">Upload</button>
                </FilePicker>
            </div>
        </>
    );
};

export default FileUpload;
