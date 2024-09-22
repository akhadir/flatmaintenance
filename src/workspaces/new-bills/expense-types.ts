import { CatItem } from '../../services/service-types';

export type ExpenseFormProps = ExpenseState & {
    callback: (state: ExpenseState) => void;
    handleClose: () => void;
    image: string;
    mimeType: string;
    expenseCategories: CatItem[];
};

export type ExpenseState = {
    date?: string,
    amount?: number,
    description?: string,
    category?: string,
    isCheckIssued?: boolean;
};

export type GoogleDriveFile = {
    id: string;
    name: string;
    mimeType: string;
    kind: string;
};
