import { CatFieldMap, ColQuery, LogicalMap } from '../services/cat-map/cat-map-types';
import { TransactionType } from '../services/redux/transactions/trans-types';
import ColQueryExecutor from './col-query-executor';
import { FlatCategory } from './flat-category';
import LogicalExecutor from './logical-executor';

export default class MaintMapExecutor {
    catFieldMap: CatFieldMap;

    public constructor(catMapJson: CatFieldMap) {
        this.catFieldMap = catMapJson;
    }

    public run(cashTransactions: TransactionType[]) {
        const categories: string[] = Object.keys(this.catFieldMap);
        cashTransactions.forEach((ctrans) => {
            if (!ctrans.Flat) {
                const flat: FlatCategory | undefined = categories.find(
                    (cat: string) => {
                        const children: LogicalMap | ColQuery[] = this.catFieldMap[cat];
                        let out;
                        if (Array.isArray(children)) {
                            out = children.every((colQuery) => {
                                const fieldQExecutor = new ColQueryExecutor(colQuery);
                                return fieldQExecutor.run(ctrans);
                            });
                        } else {
                            const logicalExec = new LogicalExecutor(children);
                            out = logicalExec.run((colQuery) => {
                                const fieldQExecutor = new ColQueryExecutor(colQuery as ColQuery);
                                return fieldQExecutor.run(ctrans);
                            });
                        }
                        return out;
                    },
                ) as FlatCategory;
                ctrans.Flat = flat;
            }
        });
    }
}
