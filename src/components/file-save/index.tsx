import moment from 'moment';
import React, { useCallback, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import gsheetUtil from '../../services/googleapis/gsheet-util-impl';

function FileSave(props: { data: { [key: string]: any }[] }) {
    const { data } = props;
    const [msg, setMsg] = useState('');
    useEffect(() => {
        gsheetUtil.init();
    }, []);

    const saveSheet = useCallback(async () => {
        const sheetTitle = 'Online Transactions';
        const sheet = await gsheetUtil.getSheetByTitle(sheetTitle);
        if (!sheet) {
            await gsheetUtil.addSheet({
                headerValues: [
                    'Date', 'Description', 'Cheque No', 'Debit', 'Credit', 'Total', 'Category', 'Flat',
                ],
                title: sheetTitle,
            });
        }
        const sheetData = (JSON.parse(JSON.stringify(data)) as any[]).map((row) => {
            row.Date = moment(row.Date).format('DD-MM-YYYY');
            return row;
        });
        await gsheetUtil.updateSheetWithJSON(sheetData, sheetTitle);
        setMsg('Sheet Updated');
    }, [data]);
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
