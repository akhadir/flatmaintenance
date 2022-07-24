import {
    CircularProgress, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCashTransactions } from '../../services/redux/cash-trans/cash-trans-actions';
import { CashTransData } from '../../services/redux/cash-trans/cash-trans-types';

function CategorizeCash() {
    const sheetInfo: CashTransData = useSelector((state: any) => state.cash);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCashTransactions() as any);
    }, [dispatch]);
    const sheetData = sheetInfo.data;
    const headers = useMemo(() => {
        let out: string[] = [];
        if (sheetData && sheetData.length > 1) {
            out = Object.keys(sheetData[0]);
        }
        return out;
    }, [sheetData]);
    console.log('value', sheetData);
    return (
        <>
            <div className="cash-trans">
                <h2>Categorize Cash Transactions</h2>
                {sheetInfo.loading && <CircularProgress />}
                {!sheetInfo.loading && (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {headers.map((header: string) => (
                                    <TableCell key={header}>{header}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!!sheetData && sheetData.map((row: { [key: string]: any }) => (
                                <TableRow>
                                    {headers.map((header: string) => (
                                        <TableCell key={`${header}-${row[header]}`}>{row[header]}</TableCell>
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
