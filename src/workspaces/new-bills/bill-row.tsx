import React, { useCallback, useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LinearProgress from '@mui/material/LinearProgress';
import {
    TableCell,
    TableRow,
    TextField,
    IconButton,
    Switch,
    MenuItem,
    Select,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { BillTransactionType } from './bill-table';
import { GoogleDriveFile } from './expense-types';
import { extractBillData } from './bill-utils';
import { CatItem } from '../../services/service-types';
import './bill-row.css';

interface BillRowProps {
    transaction: BillTransactionType;
    expenseCategories: CatItem[];
    previewBill: (event: React.MouseEvent<HTMLButtonElement>, bill: GoogleDriveFile) => void;
}

const BillRow: React.FC<BillRowProps> = ({ transaction, previewBill, expenseCategories }) => {
    console.log(transaction);
    const [showLoader, setShowLoader] = useState(false);
    const [formData, setFormData] = useState(transaction);
    useEffect(() => {
        (async () => {
            setShowLoader(true);
            const parsedFormData = await extractBillData('', transaction.bill);
            setFormData({
                ...transaction,
                parsedFormData,
            } as any);
            setShowLoader(false);
        })();
    }, [transaction]);
    const handleChange = useCallback(() => {

    }, []);
    return (
        <>
            <TableRow key={formData.bill.id} className="bill-row">
                <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            disabled={showLoader}
                            onChange={(date) => console.log(date)} // Handle change accordingly
                        />
                    </LocalizationProvider>
                </TableCell>
                <TableCell>
                    <TextField
                        disabled={showLoader}
                        value={formData.description}
                        onChange={(e) => console.log(e.target.value)} // Handle change accordingly
                        fullWidth
                    />
                </TableCell>
                <TableCell>
                    <TextField
                        type="number"
                        disabled={showLoader}
                        value={formData.amount}
                        onChange={(e) => console.log(Number(e.target.value))}
                        fullWidth
                    />
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                    <Switch
                        disabled={showLoader}
                        value={formData.isCash}
                    />
                </TableCell>
                <TableCell>
                    <IconButton
                        disabled={showLoader}
                        onMouseEnter={(e) => previewBill(e, transaction.bill)}
                    >
                        <OpenInNewIcon />
                    </IconButton>
                </TableCell>
                <TableCell>
                    <IconButton
                        disabled={showLoader}
                        aria-label="submit"
                        onClick={() => console.log('ss')}
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
