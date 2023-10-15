import React from 'react';
import {
    TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';
import moment from 'moment';
import { Transaction } from '../../services/service-types';
import './trans-preview.css';

export type TransPreviewProps = {
    xlsData: Transaction[];
}
export const TransPreview = (props: TransPreviewProps) => {
    const { xlsData: rows } = props;
    return (
        <>
            <TableContainer className="trans-preview" component={Paper}>
                <Table size="small" stickyHeader aria-label="Parsed Bank Transactions">
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
                                <TableCell>{(-1 * row.Debit) + row.Credit}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};
export default TransPreview;
