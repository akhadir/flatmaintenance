import React, { useCallback, useState, useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { Transaction } from '../../services/service-types';
import './index.css';
import AppContext from '../../services';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export type FilePreviewProps = {
    name: string;
    xlsData: Transaction[];
}
export const FilePreview = (props: FilePreviewProps) => {
    const { xlsData: rows, name } = props;
    const months: { [key: string]: string; } = useMemo(() => {
        const monthList: { [key: string]: string; } = {};
        rows.forEach((row) => {
            const month = moment(row.date).format('MMM-YY');
            monthList[month] = month;
        });
        return monthList;
    }, [rows]);
    const monthsArray = Object.values(months);
    const [selMonth, setSelMonth] = useState(monthsArray.length === 1 ? monthsArray[0] : '');
    const classes = useStyles();
    const { appData } = useContext(AppContext);
    appData.transSheetMonth = selMonth;
    const handleMonthChange = useCallback((e) => {
        if (e.target.value) {
            appData.transSheetMonth = e.target.value;
            setSelMonth(e.target.value);
        }
    }, [appData]);
    let filteredRows = rows;
    if (selMonth) {
        filteredRows = rows.filter((row) => moment(row.date).format('MMM-YY') === selMonth);
        appData.transactions = filteredRows;
    }
    return (
        <>
            <div className="preview-header">
                <div>
                    File: <h4>{name}</h4>
                </div>
                <div className="month-filter">
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
                </div>
            </div>
            <TableContainer className="xls-file-preview" component={Paper}>
                <Table className={classes.table} size="small" stickyHeader aria-label="Parsed Bank Transactions">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Cheque No.</TableCell>
                            <TableCell align="right">Withdrawal</TableCell>
                            <TableCell align="right">Deposit</TableCell>
                            <TableCell align="right">Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRows.map((row, index) => (
                            <TableRow key={row.desc}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {moment(row.date).format('DD/MM/YYYY')}
                                </TableCell>
                                <TableCell>{row.desc}</TableCell>
                                <TableCell align="right">{row.chqNo}</TableCell>
                                <TableCell align="right">{row.withDrawal}</TableCell>
                                <TableCell align="right">{row.deposit}</TableCell>
                                <TableCell align="right">{row.balance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default FilePreview;
