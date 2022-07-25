import QueryExecutor from '../query-executor';

describe('Testing Library:::QueryExecutor', () => {
    it('Tests', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'regex',
            value: ['Housekeeping.+Salary', 'House keeping.+Salary'],
        });
        const out = qExec.run('Housekeeping Salary', 'debit');
        expect(out).toBeTruthy();
    });

    it('Tests bug-fix scenario', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'having',
            value: ['N YASWANTH', 'YASWANTH'],
        });
        const out = qExec.run('Housekeeping Salary', 'debit');
        expect(out).toBeFalsy();
    });
    it('Tests bug-fix scenario - 2', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'in',
            value: ['2600', '2700', '2800', '5400', '5600', '8100', '5200', '10800'],
        });
        const out = qExec.run(2700, 'credit');
        expect(out).toBeTruthy();
    });
});