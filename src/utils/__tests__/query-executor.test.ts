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
});