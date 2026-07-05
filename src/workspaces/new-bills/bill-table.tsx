import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';
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
import BillRow, { BillRowHandle } from './bill-row';
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

export interface BillTransactionTableHandle {
    triggerFetch: (billId: string) => Promise<boolean>;
}

interface BillTransactionTableProps {
    transactions: BillTransactionType[];
    expenseCategories: CatItem[];
    handleSubmit: (bill?: ExpenseState, billId?: string) => void;
    handleSplit: (bill: GoogleDriveFile) => void;
    fetchConcurrency?: number;
    fetchDelayMs?: number;
}

const BillTransactionTableComponent = (
    {
        transactions,
        expenseCategories,
        handleSubmit,
        handleSplit,
        fetchConcurrency = 4,
        fetchDelayMs = 4000,
    }: BillTransactionTableProps,
    ref: React.ForwardedRef<BillTransactionTableHandle>,
) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const [previewBill, setPreviewBill] = React.useState<GoogleDriveFile>();
    const [activeFetches, setActiveFetches] = React.useState(0);
    const [queueStarted, setQueueStarted] = React.useState(false);
    const [rowsReady, setRowsReady] = React.useState(false);
    const rowRefs = useRef<Map<string, BillRowHandle | null>>(new Map());
    const pendingBillIdsRef = useRef<string[]>([]);
    const queueSeedRef = useRef<string[]>([]);
    const activeFetchesRef = useRef(0);
    const queueActiveRef = useRef(true);
    const processingQueueRef = useRef(false);

    const getRowKey = useCallback((billId: string | undefined | null) => (billId == null ? '' : String(billId)), []);

    const updateRowsReady = useCallback(() => {
        const transactionIds = new Set(transactions.map((transaction) => getRowKey(transaction.bill.id)));
        const registeredIds = Array.from(rowRefs.current.keys());
        const nextRowsReady = transactions.length > 0
            && registeredIds.length === transactions.length
            && registeredIds.every((id) => transactionIds.has(id));
        setRowsReady((current) => (current === nextRowsReady ? current : nextRowsReady));
    }, [getRowKey, transactions]);

    const registerRowRef = useCallback((billId: string | undefined | null) => (element: BillRowHandle | null) => {
        const rowKey = getRowKey(billId);
        if (!rowKey) {
            return;
        }

        if (!element) {
            rowRefs.current.delete(rowKey);
            updateRowsReady();
            return;
        }

        rowRefs.current.set(rowKey, element);
        updateRowsReady();
    }, [getRowKey, updateRowsReady]);

    const triggerFetch = useCallback(async (billId: string | undefined | null) => {
        const rowKey = getRowKey(billId);
        const callbackObj = rowRefs.current.get(rowKey);
        if (!rowKey || !callbackObj?.fetchBill) {
            console.warn(`No callback found for billId: ${rowKey}`);
            return false;
        }

        await callbackObj.fetchBill();
        return true;
    }, [getRowKey]);

    const processQueue = useCallback(() => {
        if (!pendingBillIdsRef.current || !queueActiveRef.current || processingQueueRef.current || !rowsReady) {
            return;
        }

        processingQueueRef.current = true;

        const dispatchNext = () => {
            if (!queueActiveRef.current || !pendingBillIdsRef.current) {
                processingQueueRef.current = false;
                return;
            }

            if (activeFetchesRef.current >= fetchConcurrency) {
                setTimeout(dispatchNext, fetchDelayMs);
                return;
            }

            const nextBillId = pendingBillIdsRef.current.shift();
            if (!nextBillId) {
                processingQueueRef.current = false;
                return;
            }

            activeFetchesRef.current += 1;
            setActiveFetches(activeFetchesRef.current);

            triggerFetch(nextBillId).catch(() => {
                queueActiveRef.current = false;
            }).finally(() => {
                activeFetchesRef.current = Math.max(0, activeFetchesRef.current - 1);
                setActiveFetches(activeFetchesRef.current);

                if (queueActiveRef.current && (pendingBillIdsRef.current?.length ?? 0) > 0) {
                    setTimeout(dispatchNext, fetchDelayMs);
                } else {
                    processingQueueRef.current = false;
                }
            });
        };

        dispatchNext();
    }, [fetchConcurrency, fetchDelayMs, rowsReady, triggerFetch]);

    useImperativeHandle(ref, () => ({ triggerFetch }), [triggerFetch]);

    useEffect(() => {
        const timerId = window.setTimeout(() => updateRowsReady(), 0);
        return () => window.clearTimeout(timerId);
    }, [transactions.length, updateRowsReady]);

    useEffect(() => {
        const transactionIds = transactions.map((transaction) => getRowKey(transaction.bill.id));
        const queueChanged = queueSeedRef.current.length !== transactionIds.length
            || queueSeedRef.current.some((id, index) => id !== transactionIds[index]) === true;

        if (queueChanged) {
            queueSeedRef.current = transactionIds;
            pendingBillIdsRef.current = [...transactionIds];
            activeFetchesRef.current = 0;
            setActiveFetches(0);
            queueActiveRef.current = true;
            processingQueueRef.current = false;
            setQueueStarted(false);
            setRowsReady(false);
        }

        if (!queueStarted ||
            !queueActiveRef.current ||
            !rowsReady ||
            activeFetches >= fetchConcurrency || (pendingBillIdsRef.current?.length ?? 0) === 0
        ) {
            return;
        }

        processQueue();
    }, [activeFetches, fetchConcurrency, getRowKey, processQueue, queueStarted, rowsReady, transactions]);
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
    const startQueue = useCallback(() => {
        setQueueStarted(true);
    }, []);

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
            <Button
                className="split-all"
                aria-label="trigger-fetch"
                onClick={startQueue}
                size="small"
                variant="contained"
                disabled={!rowsReady}
            >
                Start Fetch
            </Button>
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
                        {transactions.map((transaction) => {
                            const rowKey = getRowKey(transaction.bill.id);
                            return (
                                <BillRow
                                    key={rowKey}
                                    ref={registerRowRef(rowKey)}
                                    previewBill={onMouseEnter}
                                    transaction={transaction}
                                    expenseCategories={expenseCategories}
                                    callback={(data) => handleSubmit(data, rowKey)}
                                />
                            );
                        })}
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

const BillTransactionTable = forwardRef<BillTransactionTableHandle, BillTransactionTableProps>(
    BillTransactionTableComponent,
);
BillTransactionTable.displayName = 'BillTransactionTable';

export default BillTransactionTable;
