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
import { Transaction } from '../../services/service-types';
import './trans-preview.css';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export type TransPreviewProps = {
    xlsData: Transaction[];
}
export const TransPreview = (props: TransPreviewProps) => {
    const { xlsData: rows } = props;
    const classes = useStyles();
    return (
        <>
            <TableContainer className="trans-preview" component={Paper}>
                <Table className={classes.table} size="small" stickyHeader aria-label="Parsed Bank Transactions">
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Transaction</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={row.Description}>
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {moment(row.Date).format('DD/MM/YYYY')}
                                </TableCell>
                                <TableCell>{row.Description}</TableCell>
                                <TableCell>{(-1 * row.debit) + row.credit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default TransPreview;
