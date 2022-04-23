import { Query, TransType } from '../services/cat-map/cat-map-types';

class QueryExecutor {
    public query: Query;

    public constructor(inpQuery: Query) {
        this.query = inpQuery;
    }

    public run(fieldVal: any, transType?: TransType) {
        let res = false;
        const { opr, value: queryVal, type } = this.query;
        if (transType && type === transType) {
            switch (opr) {
            case '==': {
                res = fieldVal.toString() === queryVal.toString();
                break;
            }
            case '!=': {
                res = fieldVal.toString() !== queryVal.toString();
                break;
            }
            case '>': {
                res = fieldVal > queryVal;
                break;
            }
            case '>=': {
                res = fieldVal >= queryVal;
                break;
            }
            case '<': {
                res = fieldVal < queryVal;
                break;
            }
            case '<=': {
                res = fieldVal <= queryVal;
                break;
            }
            case 'having': {
                if (Array.isArray(queryVal)) {
                    res = queryVal.some((item) => {
                        const qval = item.toString();
                        return fieldVal.toLowerCase().indexof(qval.toLowerCase()) > -1;
                    });
                } else {
                    const qval = queryVal.toString();
                    res = fieldVal.toLowerCase().indexof(qval.toLowerCase()) > -1;
                }
                break;
            }
            case 'regex': {
                if (Array.isArray(queryVal)) {
                    res = queryVal.some((item) => {
                        const qval = item.toString();
                        const reg = new RegExp(qval, 'i');
                        res = fieldVal.match(reg)?.length > 0;
                    });
                } else {
                    const qval = queryVal.toString();
                    const reg = new RegExp(qval, 'i');
                    res = fieldVal.match(reg)?.length > 0;
                }
                break;
            }
            case 'in': {
                if (Array.isArray(queryVal)) {
                    res = queryVal.indexOf(fieldVal) > -1;
                }
                break;
            }
            default: {
                // Nothing to do
            }
            }
        }
        return res;
    }
}

export default QueryExecutor;
