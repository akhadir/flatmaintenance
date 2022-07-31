import { LogicalMap } from '../../services/cat-map/cat-map-types';
import LogicalExecutor from '../logical-executor';

describe('Testing Library:::LogicalExecutor', () => {
    it('Tests AND', async () => {
        const inpQuery: LogicalMap = {
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
        } as unknown as LogicalMap;
        expect(LogicalExecutor).toBeDefined();
        const exec = new LogicalExecutor(inpQuery)
        const res = exec.run((query) => true);
        expect(res).toBeTruthy();
        const res2 = exec.run((query) => false);
        expect(res2).toBeFalsy();
        let i = 0;
        const callback = (query: any) => {
            i += 1;
            return i % 2 === 1;
        }
        const res3 = exec.run(callback);
        expect(res3).toBeFalsy();
    });

    it('Tests NAND', async () => {
        const inpQuery: LogicalMap = {
            'nand': [
                {
                    opr: 'having',
                    value: ['upi'],
                },
                {
                    opr: 'having',
                    value: ['okaxis'],
                },
            ],
        } as unknown as LogicalMap;
        expect(LogicalExecutor).toBeDefined();
        const exec = new LogicalExecutor(inpQuery)
        const res = exec.run((query) => false);
        expect(res).toBeTruthy();
        const res2 = exec.run((query) => true);
        expect(res2).toBeFalsy();
        let i = 0;
        const callback = (query: any) => {
            i += 1;
            return i % 2 === 1;
        }
        const res3 = exec.run(callback);
        expect(res3).toBeTruthy();
    });

    it('Tests NOT', async () => {
        const inpQuery: LogicalMap = {
            'not': [
                {
                    opr: 'having',
                    value: ['upi'],
                },
                {
                    opr: 'having',
                    value: ['okaxis'],
                },
            ],
        } as unknown as LogicalMap;
        expect(LogicalExecutor).toBeDefined();
        const exec = new LogicalExecutor(inpQuery)
        const res = exec.run((query) => false);
        expect(res).toBeTruthy();
        const res2 = exec.run((query) => true);
        expect(res2).toBeFalsy();
        let i = 0;
        const callback = (query: any) => {
            i += 1;
            return i % 2 === 1;
        }
        const res3 = exec.run(callback);
        expect(res3).toBeTruthy();
    });

    it('Tests OR', async () => {
        const inpQuery: LogicalMap = {
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
        } as unknown as LogicalMap;
        expect(LogicalExecutor).toBeDefined();
        const exec = new LogicalExecutor(inpQuery)
        const res = exec.run((query) => true);
        expect(res).toBeTruthy();
        const res2 = exec.run((query) => false);
        expect(res2).toBeFalsy();
        let i = 0;
        const callback = (query: any) => {
            i += 1;
            return i % 2 === 1;
        }
        const res3 = exec.run(callback);
        expect(res3).toBeTruthy();
    });

    it('Tests NOR', async () => {
        const inpQuery: LogicalMap = {
            'nor': [
                {
                    opr: 'having',
                    value: ['upi'],
                },
                {
                    opr: 'having',
                    value: ['okaxis'],
                },
            ],
        } as unknown as LogicalMap;
        expect(LogicalExecutor).toBeDefined();
        const exec = new LogicalExecutor(inpQuery)
        const res = exec.run((query) => false);
        expect(res).toBeTruthy();
        const res2 = exec.run((query) => true);
        expect(res2).toBeFalsy();
        let i = 0;
        const callback = (query: any) => {
            i += 1;
            return i % 2 === 1;
        }
        const res3 = exec.run(callback);
        expect(res3).toBeFalsy();
    });

    it('Tests XOR', async () => {
        const inpQuery: LogicalMap = {
            'xor': [
                {
                    opr: 'having',
                    value: ['upi'],
                },
                {
                    opr: 'having',
                    value: ['okaxis'],
                },
            ],
        } as unknown as LogicalMap;
        expect(LogicalExecutor).toBeDefined();
        const exec = new LogicalExecutor(inpQuery)
        const res = exec.run((query) => false);
        expect(res).toBeFalsy();
        const res2 = exec.run((query) => true);
        expect(res2).toBeFalsy();
        let i = 0;
        const callback = (query: any) => {
            i += 1;
            return i % 2 === 1;
        }
        const res3 = exec.run(callback);
        expect(res3).toBeTruthy();
    });
});