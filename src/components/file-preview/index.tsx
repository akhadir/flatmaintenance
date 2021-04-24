import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import './index.css';
import { BankTransaction } from '../online-transactions/file-parser-util';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export type FilePreviewProps = {
    xlsData: BankTransaction[];
}
export const FilePreview = (props: FilePreviewProps) => {
    const { xlsData: rows } = props;
    const classes = useStyles();
    return (
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
                    {rows.map((row, index) => (
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
    );
};
export default FilePreview;
