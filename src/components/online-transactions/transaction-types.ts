export type Transactions = {
    date: string,
    description: string;
    itemizedDesc?: string;
    chqNo?: string;
    debit: number;
    credit: number;
    tota?: number;
};
