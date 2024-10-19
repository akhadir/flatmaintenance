import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Popover,
} from '@mui/material';
import { GoogleDriveFile } from './expense-types';
import { getDriveFileURL } from './bill-utils';
import BillRow from './bill-row';
import { CatItem } from '../../services/service-types';

// Define the type for bill transaction
export type BillTransactionType = {
    date: string;
    description: string;
    amount: number;
    category: string;
    isCash: boolean;
    bill: GoogleDriveFile;
};

// Define the categories for the autocomplete combo box
const categories = ['Food', 'Entertainment', 'Utilities', 'Transport', 'Miscellaneous'];

interface BillTransactionTableProps {
    transactions: BillTransactionType[];
    expenseCategories: CatItem[];
}

const BillTransactionTable: React.FC<BillTransactionTableProps> = ({ transactions, expenseCategories }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [previewBill, setPreviewBill] = React.useState<GoogleDriveFile>();
    const onMouseEnter = (event: React.MouseEvent<HTMLButtonElement>, bill: GoogleDriveFile) => {
        setPreviewBill(bill);
        setAnchorEl(event.currentTarget);
    };

    const onMouseLeave = () => {
        setAnchorEl(null);
        setPreviewBill(undefined);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Is Cash</TableCell>
                        <TableCell>Bill Preview</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.filter((_tran, index) => index === 0).map((transaction) => (
                        <BillRow
                            key={transaction.bill.id}
                            previewBill={onMouseEnter}
                            transaction={transaction}
                            expenseCategories={expenseCategories}
                        />
                    ))}
                </TableBody>
            </Table>
            {!!previewBill && (
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={onMouseLeave}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <iframe
                        className="expense-bill-img"
                        src={getDriveFileURL(previewBill.id)}
                        title="Expense Bill"
                    />
                </Popover>
            )}
        </TableContainer>
    );
};

export default BillTransactionTable;
