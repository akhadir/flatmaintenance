import React, { useCallback, useState } from 'react';
import { FilePicker } from 'react-file-picker';
import Alert from '@material-ui/lab/Alert';
import './index.css';

export type FileUploadProps = {
    onUpload: (file: File) => void;
}
export const FileUpload = (props: FileUploadProps) => {
    const [errorMsg, setErrorMsg] = useState<string>();
    const onUpload = useCallback((fileObject) => {
        props.onUpload(fileObject);
    }, [props]);
    const onError = useCallback((errMsg) => {
        setErrorMsg(errMsg);
    }, []);
    return (
        <>
            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            <p>Upload a transaction file (.xls) to process.</p>
            <div className="file-upload-wrapper">
                <FilePicker
                    extensions={['xls', 'xlsx']}
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
