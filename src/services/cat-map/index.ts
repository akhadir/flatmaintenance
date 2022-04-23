import JSONdb from 'simple-json-db';
import { CatFieldMap } from './cat-map-types';

const db = new JSONdb('./cat-map.json');

export const catFieldMap: CatFieldMap = db.JSON();

export const updateMapping = (json: CatFieldMap) => {
    db.JSON(json);
};

export default db;
