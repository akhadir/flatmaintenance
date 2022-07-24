import { TransCategory } from '../../utils/trans-category';

export type Operation = 'in' | 'having' | 'regex' | '==' | '>' | '>=' | '<' | '<=' | '!=';
export type TransType = 'debit' | 'credit';
export type Query = {
    opr: Operation;
    value: string[] | string | number | boolean;
    type?: TransType;
};
export type ColQuery = {
    [colName: string]: Query[];
};
export type CatFieldMap = {
    [category: string]: ColQuery[];
};
