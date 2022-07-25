import { TransactionType } from '../../services/redux/transactions/trans-types';
import TransMapExecutor from '../trans-map-executor';

jest.mock('../../services/cat-map/cat-map', () => ({
    'House Keeping Salary': [{
        Description: [{
            opr: 'regex',
            value: ['Housekeeping.+Salary', 'House keeping.+Salary'],
        }],
    }],
}));

describe('Testing Library:::TransMapExecutor', () => {

    it('Tests', async () => {
        expect(TransMapExecutor).toBeDefined();
    });

    it('Tests basic usecase', () => {
        const transMapExec = new TransMapExecutor();
        let inputTransaction: TransactionType = {
            Credit: null,
            Debit: 1000,
            Description: 'Housekeeping Salary',
            Date: '1242',
            Total: 123223,
        };
        transMapExec.run([inputTransaction]);
        expect(inputTransaction.Category).toBe('House Keeping Salary');
    });

    it('Tests basic usecase - 2', () => {
        const transMapExec = new TransMapExecutor();
        let inputTransaction: TransactionType = {
            "Date": "02/04/2021",
            "Description": "UPI/109219775040/19:52:21/UPI/rohinimh19@okaxis/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00" as any,
            "Total": "10,44,754.21" as any,
        };
        transMapExec.run([inputTransaction]);
        expect(inputTransaction.Category).toBe('Flat Maintenance');
    });
});