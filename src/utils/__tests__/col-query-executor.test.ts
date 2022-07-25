import ColQueryExecutor from '../col-query-executor';

describe('Testing Library:::ColQueryExecutor', () => {
    it('Tests Scenario - 1' , async () => {
        expect(ColQueryExecutor).toBeDefined();
        const colQExec = new ColQueryExecutor({
            Credit: [{
                opr: 'in',
                value: ['2600', '2,700.00', '2700', '2800', '5400', '5600', '8100', '5200', '10800'],
            }],
            Description: [{
                opr: 'having',
                value: ['maintenance', 'neft', 'upi', 'imps'],
            }],
        });
        const out = colQExec.run({
            Date: '04/04/2021',
            Description: 'Maintenance Received from 007',
            Credit: 2700,
            Debit: null,
            Total: 122323,
        }, 'credit');
        expect(out).toBeTruthy();
    });

    it('Tests Scenario - 2', async () => {
        const colQExec = new ColQueryExecutor({
            Credit: [{
                opr: 'in',
                value: ['2600', '2,700.00', '2700', '2800', '5400', '5600', '8100', '5200', '10800'],
            }],
            Description: [{
                opr: 'having',
                value: ['maintenance', 'neft', 'upi', 'imps'],
            }],
        });
        const out = colQExec.run({
            "Date": "02/04/2021",
            "Description": "UPI/109219775040/19:52:21/UPI/rohinimh19@okaxis/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00",
            "Total": "10,44,754.21"
        }, 'credit');
        expect(out).toBeTruthy();
    });
});