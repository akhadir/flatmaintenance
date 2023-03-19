import DataUtils from '../data-utils';
import { transactionData, sortedTransactionData } from '../__data__/brank-transactions';

describe('Testing Library:::DataUtils', () => {

    it('Tests', async () => {
        expect(DataUtils).toBeDefined();
        const sortedData = DataUtils.sortColumn(transactionData, 0);
        expect(sortedData).toEqual(sortedTransactionData);
    });

});