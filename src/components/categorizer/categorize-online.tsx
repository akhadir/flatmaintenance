import {
    CircularProgress, TableBody, TableCell, TableHead, TableRow,
} from '@material-ui/core';
import moment from 'moment';
import Table from '@material-ui/core/Table';
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOnlineTransactions } from '../../services/redux/transactions/trans-actions';
import { TransData } from '../../services/redux/transactions/trans-types';

function CategorizeOnline() {
    const sheetInfo: TransData = useSelector((state: any) => state.trans);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchOnlineTransactions('Online Transactions') as any);
    }, [dispatch]);
    const sheetData = sheetInfo.onlineTransData;
    const headers = useMemo(() => {
        let out: string[] = [];
        if (sheetData && sheetData.length > 1) {
            out = Object.keys(sheetData[0]);
        }
        return out;
    }, [sheetData]);
    return (
        <>
            <div className="online-trans">
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
                                                moment(row[header], 'DD-MM-YYYY').format('DD/MM/YYYY')}
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

export default CategorizeOnline;
