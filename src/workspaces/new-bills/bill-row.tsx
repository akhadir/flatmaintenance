/* eslint-disable max-len */
import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LinearProgress from '@mui/material/LinearProgress';
import {
    // Checkbox,
    TableCell,
    TableRow,
    TextField,
    IconButton,
    Switch,
    MenuItem,
    Select,
    Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SyncIcon from '@mui/icons-material/Sync';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import dayjs from 'dayjs';
import { BillTransactionType } from './bill-table';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import { extractBillData } from './bill-utils';
import { CatItem } from '../../services/service-types';
import './bill-row.css';

interface BillRowProps {
    transaction: BillTransactionType;
    expenseCategories: CatItem[];
    callback: (state: ExpenseState) => void;
    previewBill: (event: React.MouseEvent<HTMLButtonElement>, bill: GoogleDriveFile) => void;
}

const BillRow: React.FC<BillRowProps> = ({ transaction, previewBill, expenseCategories, callback }) => {
    const [showLoader, setShowLoader] = useState(false);
    const [formData, setFormData] = useState(transaction);
    const [formCompleted, setFormCompleted] = useState(false);
    const fetch = useCallback(async () => {
        setShowLoader(true);
        const parsedFormData = await extractBillData('', transaction.bill);
        setFormData({
            ...transaction,
            ...parsedFormData,
            isCash: !parsedFormData.isChequeIssued,
        } as any);
        setShowLoader(false);
    }, [transaction]);
    const [errorData, setErrorData] = useState({
        date: '',
        amount: '',
        description: '',
        category: '',
        transactionType: '',
    });

    const handleChange = useCallback((event: any) => {
        const { name, value } = event.target || event;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        let error = false;
        if (!formData.amount) {
            errorData.amount = 'Enter a valid amount';
            error = true;
        } else {
            errorData.amount = '';
        }
        if (!formData.date || formData.date.toLowerCase() === 'invalid date') {
            errorData.date = 'Enter a valid date';
            error = true;
        } else {
            errorData.date = '';
        }
        if (!formData.description) {
            errorData.description = 'Enter a valid description';
            error = true;
        } else {
            errorData.description = '';
        }
        if (!formData.category) {
            errorData.category = 'Select a category';
            error = true;
        } else {
            errorData.category = '';
        }
        if (error) {
            setErrorData({ ...errorData });
        } else {
            const formDataClone = JSON.parse(JSON.stringify(formData));
            callback(formDataClone);
            setFormCompleted(true);
        }
    }, [callback, errorData, formData]);
    useEffect(() => {
        if (!formData.date) {
            const date = '01-04-2024';
            setFormData({ ...formData, date });
        }
    }, [formData, formData.date]);
    return (
        <>
            <TableRow key={formData.bill.id} className={formCompleted ? 'form-completed bill-row' : 'bill-row'}>
                {/* <TableCell>
                    <Checkbox onChange={handleChange} name="enable" value />
                </TableCell> */}
                <TableCell>
                    <IconButton
                        disabled={showLoader}
                        onMouseEnter={(e) => previewBill(e, transaction.bill)}
                    >
                        <OpenInNewIcon />
                    </IconButton>
                </TableCell>
                <TableCell className={errorData.date ? 'cell-error' : ''}>
                    <Tooltip title={errorData.date}>
                        <div className="date-wrapper">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    disabled={showLoader}
                                    format="DD-MM-YYYY"
                                    closeOnSelect
                                    value={dayjs(moment(formData.date, 'DD-MM-YYYY').format('YYYY-MM-DD'))}
                                    onChange={(e: any) => handleChange({ value: e.format('DD-MM-YYYY'), name: 'date' })}
                                />
                            </LocalizationProvider>
                        </div>
                    </Tooltip>
                </TableCell>
                <TableCell className={errorData.description ? 'cell-error' : ''}>
                    <Tooltip title={errorData.description}>
                        <TextField
                            name="description"
                            disabled={showLoader}
                            value={formData.description}
                            onChange={handleChange} // Handle change accordingly
                            fullWidth
                        />
                    </Tooltip>
                </TableCell>
                <TableCell className={errorData.amount ? 'cell-error' : ''}>
                    <Tooltip title={errorData.amount}>
                        <TextField
                            name="amount"
                            type="number"
                            disabled={showLoader}
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Tooltip>
                </TableCell>
                <TableCell className={errorData.category ? 'cell-error' : ''}>
                    <Tooltip title={errorData.category}>
                        <Select
                            className="bill-category"
                            fullWidth
                            disabled={showLoader}
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            {expenseCategories.map((cat) => (
                                <MenuItem key={cat.key} value={cat.key}>{cat.label}</MenuItem>
                            ))}
                        </Select>
                    </Tooltip>
                </TableCell>
                <TableCell>
                    <Switch
                        name="isCash"
                        disabled={showLoader}
                        checked={!!formData.isCash}
                        value
                        onClick={() => handleChange({ name: 'isCash', value: !formData.isCash })}
                    />
                </TableCell>
                <TableCell>
                    {!showLoader && (
                        <IconButton
                            disabled={showLoader || formCompleted}
                            aria-label="fetch"
                            onClick={fetch}
                        >
                            <SyncIcon />
                        </IconButton>
                    )}
                    <IconButton
                        disabled={showLoader || formCompleted}
                        aria-label="submit"
                        onClick={handleSubmit}
                    >
                        <SendIcon />
                    </IconButton>

                </TableCell>
            </TableRow>
            {showLoader && (
                <TableRow className="loader-row">
                    <LinearProgress color="success" />
                </TableRow>
            )}
        </>
    );
};

export default BillRow;
