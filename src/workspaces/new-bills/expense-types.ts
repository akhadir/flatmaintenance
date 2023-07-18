import { CatItem } from '../../services/service-types';

export type ExpenseFormProps = ExpenseState & {
    callback: (state: ExpenseState) => void;
    handleClose: () => void;
    image: string;
    expenseCategories: CatItem[];
};

export type ExpenseState = {
    date?: string,
    amount?: number,
    description?: string,
    category?: string,
};

export type GoogleDriveFile = {
    id: string;
    name: string;
    mimeType: string;
    kind: string;
};
