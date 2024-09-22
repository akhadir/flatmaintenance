import moment from 'moment';
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { fetchTransactions } from '../../services/redux/transactions/trans-actions';
import { TransData } from '../../services/redux/transactions/trans-types';

function CategorizeCash() {
    const sheetInfo: TransData = useSelector((state: any) => state.trans);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchTransactions() as any);
    }, [dispatch]);
    const sheetData = useMemo(() => sheetInfo.cashTransData, [sheetInfo]);
    const headers = useMemo(() => {
        let out: string[] = [];
        if (sheetData && sheetData.length >= 1) {
            out = Object.keys(sheetData[0]);
        }
        return out;
    }, [sheetData]);
    return (
        <>
            <div className="cash-trans">
                {sheetInfo.loading && <CircularProgress />}
                {!sheetInfo.loading && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Sl. No.</TableCell>
                                {headers.map((header: string) => (
                                    <TableCell key={header}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!sheetData && sheetData.map((row: { [key: string]: any }, index) => (
                                <TableRow key={JSON.stringify(row)}>
                                    <TableCell>{index + 1}</TableCell>
                                    {headers.map((header: string) => (
                                        <TableCell key={`${header}-${row[header]}`}>
                                            {header !== 'Date' ? row[header] :
                                                moment(row[header], 'DD/MM/YYYY').format('DD/MM/YYYY')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </>
    );
}

export default CategorizeCash;
