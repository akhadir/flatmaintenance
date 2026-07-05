import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BillTransactionTable, { BillTransactionType } from '../bill-table';

const rowFetches: jest.Mock[] = [];

jest.mock('../bill-row', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: React.forwardRef(({ transaction }: any, ref: any) => {
            const fetchBill = React.useMemo(() => jest.fn().mockResolvedValue(undefined), []);
            rowFetches.push(fetchBill);
            React.useImperativeHandle(ref, () => ({
                fetchBill,
                isFetching: () => false,
            }));
            return <tr data-testid={`row-${transaction.bill.id}`}><td>{transaction.bill.id}</td></tr>;
        }),
    };
});

jest.mock('../bill-utils', () => ({
    getDriveFileURL: jest.fn(() => 'https://example.com/bill.pdf'),
}));

describe('BillTransactionTable queue', () => {
    const createTransaction = (id: string): BillTransactionType => ({
        date: '01-04-2024',
        description: 'desc',
        amount: 10,
        category: 'cat',
        isCash: true,
        bill: { id, name: id, mimeType: 'application/pdf' } as any,
    });

    beforeEach(() => {
        rowFetches.length = 0;
    });

    it('retries a bill when its row ref is not ready yet', async () => {
        const transactions = [createTransaction('bill-1')];
        const handleSubmit = jest.fn();
        const handleSplit = jest.fn();
        const { container } = render(
            <BillTransactionTable
                transactions={transactions}
                expenseCategories={[]}
                handleSubmit={handleSubmit}
                handleSplit={handleSplit}
                fetchConcurrency={1}
                fetchDelayMs={0}
            />,
        );

        await waitFor(() => expect(screen.getByRole('button', { name: /trigger-fetch/i })).not.toBeDisabled());
        fireEvent.click(screen.getByRole('button', { name: /trigger-fetch/i }));

        await waitFor(() => expect(container.querySelector('[data-testid="row-bill-1"]')).toBeTruthy());
    });

    it('dispatches fetches for every row in the queue', async () => {
        const transactions = [createTransaction('bill-1'), createTransaction('bill-2')];
        const handleSubmit = jest.fn();
        const handleSplit = jest.fn();

        render(
            <BillTransactionTable
                transactions={transactions}
                expenseCategories={[]}
                handleSubmit={handleSubmit}
                handleSplit={handleSplit}
                fetchConcurrency={1}
                fetchDelayMs={0}
            />,
        );

        await waitFor(() => expect(screen.getByRole('button', { name: /trigger-fetch/i })).not.toBeDisabled());
        fireEvent.click(screen.getByRole('button', { name: /trigger-fetch/i }));

        await waitFor(() => expect(rowFetches[0]).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(rowFetches[1]).toHaveBeenCalledTimes(1));
    });
});
