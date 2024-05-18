import { CatItem } from '../../services/service-types';

export type ExpenseFormProps = ExpenseState & {
    callback: (state: ExpenseState) => void;
    handleClose: () => void;
    image: string;
    mimeType: string;
    expenseCategories: CatItem[];
};

export enum TransType {
    Online = 'Online',
    Cash = 'Cash',
}

export type ExpenseState = {
    date?: string,
    amount?: number,
    description?: string,
    category?: string,
    transactionType?: TransType;
};

export type GoogleDriveFile = {
    id: string;
    name: string;
    mimeType: string;
    kind: string;
};
