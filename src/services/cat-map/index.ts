import JSONdb from 'simple-json-db';
import { CatFieldMap } from './cat-map-types';
import catFieldMap from './cat-map';

const db = new JSONdb('./cat-map.json');

export const updateMapping = (json: CatFieldMap) => {
    db.JSON(json);
};

updateMapping(catFieldMap as any as CatFieldMap);

export default db;

// Usage:
// const transMapExec = new TransMapExecutor(catMapJson as any);
// transMapExec.run(value as TransactionType[]);
//
