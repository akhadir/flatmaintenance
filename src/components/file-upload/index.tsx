import React, { useCallback, useState } from 'react';
import { FilePicker } from 'react-file-picker';
import './index.css';
import { Alert } from '@mui/material';

export type FileUploadProps = {
    onUpload: (file: File) => void;
}
export const FileUpload = (props: FileUploadProps) => {
    const [errorMsg, setErrorMsg] = useState<string>();
    const onUpload = useCallback((fileObject: File) => {
        props.onUpload(fileObject);
    }, [props]);
    const onError = useCallback((errMsg: React.SetStateAction<string | undefined>) => {
        setErrorMsg(errMsg);
    }, []);
    return (
        <>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <p>Upload a transaction file (.csv or .xls) to process.</p>
            <div className="file-upload-wrapper">
                <FilePicker
                    extensions={['csv', 'xls', 'xlsx']}
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
