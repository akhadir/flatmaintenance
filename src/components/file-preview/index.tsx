import React, { useCallback, useState, useContext, useMemo } from 'react';
import moment from 'moment';
import {
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import AppContext from '../../services';
import { Transaction } from '../../services/service-types';
import './index.css';

export type FilePreviewProps = {
    name: string;
    xlsData: Transaction[];
}
export const FilePreview = (props: FilePreviewProps) => {
    const { xlsData: rows, name } = props;
    const months: { [key: string]: string; } = useMemo(() => {
        const monthList: { [key: string]: string; } = {};
        rows.forEach((row) => {
            const month = moment(row.Date).format('MMM-YY');
            monthList[month] = month;
        });
        return monthList;
    }, [rows]);
    const monthsArray = Object.values(months);
    const [selMonth, setSelMonth] = useState(monthsArray.length === 1 ? monthsArray[0] : '');
    const { appData } = useContext(AppContext);
    appData.transSheetMonth = selMonth;
    const handleMonthChange = useCallback((e: any) => {
        if (e.target.value) {
            appData.transSheetMonth = e.target.value;
            setSelMonth(e.target.value);
        }
    }, [appData]);
    let filteredRows = rows;
    if (selMonth) {
        filteredRows = rows.filter((row) => moment(row.Date).format('MMM-YY') === selMonth);
        appData.transactions = filteredRows;
    }
    const saveSheet = useCallback(() => {
        // gsheetUtil.addSheet({
        //     headerValues: [
        //         'Date', 'Description', 'Cheque No', 'Debit', 'Credit', 'Total', 'Category',
        //     ],
        //     title: 'Online Transactions',
        // }).then((sheet) => {
        //     resolve([]);
        // });
    }, []);
    return (
        <>
            <div className="preview-header">
                <div>
                    File: <h4>{name}</h4>
                </div>
                {/* <div className="tools">
                    <Button variant="outlined" onClick={saveSheet}>Save Sheet</Button>
                </div> */}
                {/* <div className="month-filter">
                    Month: &nbsp;
                    <Select
                        value={selMonth}
                        onChange={handleMonthChange}
                        displayEmpty
                        inputProps={{ 'aria-label': 'Month Filter' }}
                    >
                        <MenuItem value=""><em>Select a Month:</em></MenuItem>
                        {monthsArray.map((month) => (
                            <MenuItem value={month}>{month}</MenuItem>
                        ))}
                    </Select>
                </div> */}
            </div>
            <TableContainer className="xls-file-preview" component={Paper}>
                <Table size="small" stickyHeader aria-label="Parsed Bank Transactions">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Cheque No.</TableCell>
                            <TableCell align="right">Debit</TableCell>
                            <TableCell align="right">Credit</TableCell>
                            <TableCell align="right">Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row, index) => (
                            <TableRow key={`${row.Date}-${row.Description}`}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {moment(row.Date).format('DD-MM-YYYY')}
                                </TableCell>
                                <TableCell>{row.Description}</TableCell>
                                <TableCell align="right">{row['Cheque No']}</TableCell>
                                <TableCell align="right">{row.Debit}</TableCell>
                                <TableCell align="right">{row.Credit}</TableCell>
                                <TableCell align="right">{row.Total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default FilePreview;
