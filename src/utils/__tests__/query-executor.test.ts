import QueryExecutor from '../query-executor';

describe('Testing Library:::QueryExecutor', () => {
    it('Tests REGEX operator', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'regex',
            value: ['Housekeeping.+Salary', 'House keeping.+Salary'],
        });
        const out = qExec.run('Housekeeping Salary');
        expect(out).toBeTruthy();
    });

    it('Tests HAVING operator', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'having',
            value: ['N YASWANTH', 'YASWANTH'],
        });
        const out = qExec.run('Housekeeping Salary');
        expect(out).toBeFalsy();
    });
    it('Tests IN operator', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'in',
            value: ['2600', '2700', '2800', '5400', '5600', '8100', '5200', '10800'],
        });
        const out = qExec.run(2700);
        expect(out).toBeTruthy();
    });
    it('Tests RANGE operator', async () => {
        expect(QueryExecutor).toBeDefined();
        const qExec = new QueryExecutor({
            opr: 'range',
            value: [14000, 15000],
        });
        const out = qExec.run('14100');
        expect(out).toBeTruthy();
    });
});