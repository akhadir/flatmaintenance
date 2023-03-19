import { LogicalMap } from '../../services/cat-map/cat-map-types';
import ColQueryExecutor from '../col-query-executor';

describe('Testing Library:::ColQueryExecutor', () => {
    it('Tests Scenario - 1' , () => {
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
        });
        expect(out).toBeTruthy();
    });

    it('Tests Scenario - 2', () => {
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
        });
        expect(out).toBeTruthy();
    });

    it('Tests Scenario With Logical Expression - AND', () => {
        const colQExec = new ColQueryExecutor({
            Description: {
                'and': [
                    {
                        opr: 'having',
                        value: ['upi'],
                    },
                    {
                        opr: 'having',
                        value: ['okaxis'],
                    },
                ],
            } as unknown as LogicalMap,
        });
        const out = colQExec.run({
            "Date": "02/04/2021",
            "Description": "UPI/109219775040/19:52:21/UPI/rohinimh19@okaxis/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00",
            "Total": "10,44,754.21"
        });
        expect(out).toBeTruthy();
        const out2 = colQExec.run({
            "Date": "02/04/2021",
            "Description": "UPI/109219775040/19:52:21/UPI/rohinimh19@icici/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00",
            "Total": "10,44,754.21"
        });
        expect(out2).toBeFalsy();
    });

    it('Tests Scenario With Logical Expression - OR', () => {
        const colQExec = new ColQueryExecutor({
            Description: {
                'or': [
                    {
                        opr: 'having',
                        value: ['upi'],
                    },
                    {
                        opr: 'having',
                        value: ['okaxis'],
                    },
                ],
            } as unknown as LogicalMap,
        });
        const out = colQExec.run({
            "Date": "02/04/2021",
            "Description": "UPI/109219775040/19:52:21/UPI/rohinimh19@okaxis/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00",
            "Total": "10,44,754.21"
        });
        expect(out).toBeTruthy();
        const out2 = colQExec.run({
            "Date": "02/04/2021",
            "Description": "upi/109219775040/19:52:21/UPI/rohinimh19@icici/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00",
            "Total": "10,44,754.21"
        });
        expect(out2).toBeTruthy();
        const out3 = colQExec.run({
            "Date": "02/04/2021",
            "Description": "NEFT/109219775040/19:52:21/UPI/rohinimh19@icici/U",
            "Cheque No": null,
            "Debit": null,
            "Credit": "2,700.00",
            "Total": "10,44,754.21"
        });
        expect(out3).toBeTruthy();
    });
    it('Tests Scenario - Range Operator' , () => {
        expect(ColQueryExecutor).toBeDefined();
        const colQExec = new ColQueryExecutor({
            Debit: [{
                opr: 'range',
                value: [14000, 15000],
            }],
            Description: [{
                opr: 'having',
                value: ['BANGALORE WATER SUPPLY', 'BWSSB', 'BANGALORE ONE', 'EBANK:BBPS'],
            }],
        });
        const out = colQExec.run({
            Date: '04/04/2021',
            Description: 'EBANK:BBPS/2313232323232/232323/23232',
            Credit: null,
            Debit: 14100,
            Total: 122323,
        });
        expect(out).toBeTruthy();
    });
});
