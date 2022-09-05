export type Operation = 'in' | 'having' | 'regex' | '==' | '>' | '>=' | '<' | '<=' | '!=';
export type TransType = 'debit' | 'credit';
export type Query = {
    opr: Operation;
    value: string[] | string | number | boolean;
    type?: TransType;
};
export type ColQuery = {
    [colName: string]: Query[] | LogicalMap;
};
export type CatFieldMap = {
    [category: string]: LogicalMap | ColQuery[];
};
export enum LogicalOpr {
    'and' = 'and',
    'or' = 'or',
    'xor' = 'xor',
    'not' = 'not',
    'nand' = 'nand',
    'nor' = 'nor',
}
export type LogicalMap = {
    [opr in LogicalOpr | string]: Array<Query | ColQuery>;
};
