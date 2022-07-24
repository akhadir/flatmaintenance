import { CashTransType } from '../../services/redux/cash-trans/cash-trans-types';
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
        let inputTransaction: CashTransType = {
            Credit: null,
            Debit: 1000,
            Description: 'Housekeeping Salary',
            Date: '1242',
            Total: 123223,
        };
        transMapExec.run([inputTransaction]);
        expect(inputTransaction.Category).toBe('House Keeping Salary');
    });
});