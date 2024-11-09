import MaintMapExecutor from '../maint-map-executor';
import ColQueryExecutor from '../col-query-executor';
import { TransactionType } from '../../services/redux/transactions/trans-types';
import catFieldMap from '../../services/maint-map/maint-map';

describe('MaintMapExecutor', () => {
    let cashTransactions: TransactionType[];

    beforeEach(() => {
        jest.clearAllMocks();

        // Set up default values for each test
       
        cashTransactions = [
            {
                Date: '12/05/2024',
                Description: 'NEFT-N133243035410252-AKARSH PRAVEEN RAJ',
                Debit: 0,
                Credit: 3200,
                Total: 232443434
            }            
        ];
    });

    it('should initialize with catFieldMap JSON', () => {
        const executor = new MaintMapExecutor(catFieldMap as any);
        expect(executor.catFieldMap).toBe(catFieldMap);
    });

    it('should assign Flat category if transaction matches ColQuery criteria', () => {
        // Mock ColQueryExecutor to always return true
        const executor = new MaintMapExecutor(catFieldMap as any);
        executor.run(cashTransactions);

        expect(cashTransactions[0].Flat).toBe("406");
    });

});
