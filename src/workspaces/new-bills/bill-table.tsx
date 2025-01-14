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
    Button,
} from '@mui/material';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import {
    getDriveFileURL,
} from './bill-utils';
import BillRow from './bill-row';
import { CatItem } from '../../services/service-types';
import './bill-table.css';

// Define the type for bill transaction
export type BillTransactionType = {
    date: string;
    description: string;
    amount: number;
    category: string;
    isCash: boolean;
    bill: GoogleDriveFile;
};

interface BillTransactionTableProps {
    transactions: BillTransactionType[];
    expenseCategories: CatItem[];
    handleSubmit: (bill?: ExpenseState, billId?: string) => void;
    handleSplit: (bill: GoogleDriveFile) => void;
}

const BillTransactionTable: React.FC<BillTransactionTableProps> = (
    { transactions, expenseCategories, handleSubmit, handleSplit }) => {
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
        <>
            {transactions.length === 1 && (
                <Button
                    className="split-all"
                    aria-label="split"
                    onClick={() => handleSplit(transactions[0].bill)}
                    size="small"
                >
                    Split the Bill
                </Button>
            )}
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>#</TableCell> */}
                            <TableCell>Bill Preview</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Is Cash</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <BillRow
                                key={transaction.bill.id}
                                previewBill={onMouseEnter}
                                transaction={transaction}
                                expenseCategories={expenseCategories}
                                callback={(data) => handleSubmit(data, transaction.bill.id)}
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
        </>
    );
};

export default BillTransactionTable;
