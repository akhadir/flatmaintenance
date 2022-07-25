import { ColQuery, TransType } from '../services/cat-map/cat-map-types';
import { TransactionType } from '../services/redux/transactions/trans-types';
import QueryExecutor from './query-executor';

export default class ColQueryExecutor {
    public query: ColQuery;

    public constructor(inpQuery: ColQuery) {
        this.query = inpQuery;
    }

    run(transaction: { [index: string]: any }, transType?: TransType) {
        return Object.keys(this.query).every((columnName) => this.query[columnName].every((query) => {
            const qExecutor = new QueryExecutor(query);
            const fieldVal: any = transaction[columnName];
            return qExecutor.run(fieldVal, transType);
        }));
    }
}
