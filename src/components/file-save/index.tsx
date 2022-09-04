import { Button } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import gsheetUtil from '../../services/googleapi';

function FileSave() {
    const [msg, setMsg] = useState('');
    const saveSheet = useCallback(() => {
        gsheetUtil.addSheet({
            headerValues: [
                'Date', 'Description', 'Cheque No', 'Debit', 'Credit', 'Total', 'Category',
            ],
            title: 'Online Transactions',
        }).then((sheet) => {
            setMsg('Transactions Saved');
        });
    }, []);
    return (
        <>
            <p>{msg}</p>
            <div className="tools">
                <Button variant="outlined" onClick={saveSheet}>Save Sheet</Button>
            </div>
        </>
    );
}

export default FileSave;
