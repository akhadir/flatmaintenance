import {
    ColQuery, LogicalMap, LogicalOpr, Query,
} from '../services/cat-map/cat-map-types';

class LogicalExecutor {
    public query: LogicalMap;

    public constructor(inpQuery: LogicalMap) {
        this.query = inpQuery;
    }

    run(execute: (query: Query | ColQuery) => boolean) {
        return Object.keys(this.query).every((opr: LogicalOpr | string) => {
            const children: Array<Query | ColQuery> = this.query[opr];
            switch (opr) {
            case LogicalOpr.or:
                return children.some((child) => execute(child));
            case LogicalOpr.nor:
                return !children.some((child) => execute(child));
            case LogicalOpr.xor: {
                const res = children.map((child) => execute(child));
                return res.some((child) => child === true) && res.some((child) => child === false);
            }
            case LogicalOpr.nand:
            case LogicalOpr.not:
                return !(children.every((child: any) => execute(child)));
            case LogicalOpr.and:
            default:
                return children.every((child: any) => execute(child));
            }
        });
    }
}

export default LogicalExecutor;
