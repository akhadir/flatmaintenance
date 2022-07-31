import { ColQuery, Query, TransType } from '../services/cat-map/cat-map-types';
import LogicalExecutor from './logical-executor';
import QueryExecutor from './query-executor';

export default class ColQueryExecutor {
    public query: ColQuery;

    public constructor(inpQuery: ColQuery) {
        this.query = inpQuery;
    }

    run(transaction: { [index: string]: any }) {
        return Object.keys(this.query).every((columnName) => {
            const children = this.query[columnName];
            let out = false;
            if (Array.isArray(children)) {
                out = children.every((query) => {
                    const qExecutor = new QueryExecutor(query);
                    const fieldVal: any = transaction[columnName];
                    return qExecutor.run(fieldVal);
                });
            } else {
                const logicalExec = new LogicalExecutor(children);
                out = logicalExec.run((query) => {
                    const qExecutor = new QueryExecutor(query as Query);
                    const fieldVal: any = transaction[columnName];
                    return qExecutor.run(fieldVal);
                });
            }
            return out;
        });
    }
}
