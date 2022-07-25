import { CatFieldMap } from '../services/cat-map/cat-map-types';
import { TransactionType } from '../services/redux/transactions/trans-types';
import CatMapJson from '../services/cat-map/cat-map';
import ColQueryExecutor from './col-query-executor';
import { TransCategory } from './trans-category';

export default class TransMapExecutor {
    catFieldMap: CatFieldMap;

    public constructor() {
        this.catFieldMap = CatMapJson as any;
    }

    public run(cashTransactions: TransactionType[]) {
        const categories: string[] = Object.keys(CatMapJson);
        cashTransactions.forEach((ctrans) => {
            if (!ctrans.Category) {
                const category: TransCategory | undefined = categories.find(
                    (cat: string) => this.catFieldMap[cat].every((colQuery) => {
                        const fieldQExecutor = new ColQueryExecutor(colQuery);
                        return fieldQExecutor.run(ctrans, ctrans.Debit ? 'debit' : 'credit');
                    })) as TransCategory;
                ctrans.Category = category;
            }
        });
    }
}
