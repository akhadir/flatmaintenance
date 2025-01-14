import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { VERIFIED_FILE_PREFIX, renameFile } from '../../services/googleapis/drive-util';
// import BillGrid from './bill-grid';
import BillTable, { BillTransactionType } from './bill-table';
import ExpenseForm from './expense';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import {
    extractBillData, fetchFiles, getDataInSheetFormat, saveCashTransSheet, saveOnlineTransactionWithBill,
} from './bill-utils';
import FolderGrid from './folder-grid';
import { TransSheet } from '../../services/sheet';
import { CatItem } from '../../services/service-types';
import './new-bills.css';
import splitAndSaveLocally from '../../services/pdf/split-pdf';

export default function NewBills() {
    const [showLoader, setShowLoader] = useState(false);
    const [fileList, setFilesList] = useState<GoogleDriveFile[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBill, setSelectedBill] = useState<GoogleDriveFile>();
    const [selectedFolder, setSelectedFolder] = useState('');
    const [formData, setFormData] = useState<ExpenseState>({
        date: '',
        amount: 0,
        description: '',
        category: '',
    });
    const handleFolderClick = useCallback((folderId: string) => {
        setSelectedFolder(folderId);
    }, []);
    const handleClick = useCallback(async (image: GoogleDriveFile) => {
        setSelectedBill(image);
        setShowLoader(true);
        const fileInfo = fileList.find((file) => file.id === image.id);
        const fileName = fileInfo?.name;
        const parsedFormData = await extractBillData(fileName, image);
        setShowLoader(false);
        setFormData(parsedFormData);
        setOpenDialog(true);
    }, [fileList]);

    const handleSplit = useCallback((bill: GoogleDriveFile) => {
        splitAndSaveLocally(bill.id)
            .then(() => console.log('Operation completed successfully.'))
            .catch((error) => console.error('Error:', error));
    }, []);

    const handleClose = useCallback((data?: ExpenseState, billId?: string) => {
        const selectedBillId = billId || selectedBill?.id;
        if (selectedBillId && data?.date) {
            const fileInfo = fileList.find((file) => file.id === selectedBillId);
            if (selectedBillId && fileInfo) {
                renameFile(selectedBillId, fileInfo.name).then(() => {
                    fetchFiles(setFilesList, selectedFolder);
                    if (!data.isChequeIssued) {
                        const finalData = [getDataInSheetFormat(data, selectedBillId)];
                        saveCashTransSheet(finalData);
                    } else {
                        saveOnlineTransactionWithBill(data, selectedBillId);
                    }
                });
            }
        }
        setSelectedBill(undefined);
        setOpenDialog(false);
    }, [fileList, selectedBill, selectedFolder]);

    useEffect(() => {
        fetchFiles(setFilesList, selectedFolder);
    }, [selectedFolder]);

    const [expenseCategories, setExpenseCategories] = useState<CatItem[]>([]);
    useEffect(() => {
        (async () => {
            const transSheet = new TransSheet();
            const expCat = await transSheet.getExpenseCategories();
            setExpenseCategories(expCat);
        })();
    }, []);
    const bills = useMemo(() => fileList.filter(
        (file) => (
            (file.mimeType.startsWith('image/') ||
            file.mimeType === 'application/pdf') &&
            !file.name.startsWith(VERIFIED_FILE_PREFIX)
        ),
    ), [fileList]);

    const billsObj: BillTransactionType[] = useMemo(() => bills.map((bill) => ({
        date: '',
        description: '',
        amount: 0,
        category: '',
        isCash: true,
        bill,
    })), [bills]);
    const folders = useMemo(() => fileList.filter(
        (file) => file.mimeType === 'application/vnd.google-apps.folder'), [fileList]);

    return (
        <div className="bill-workspace">
            {!!selectedFolder && (
                <IconButton onClick={() => setSelectedFolder('')} aria-label="Back">
                    <ArrowBackIcon />
                </IconButton>
            )}
            <h3 className="inline-h3">Unprocessed Bills</h3>
            {!selectedFolder && <FolderGrid folders={folders} handleClick={handleFolderClick} />}
            {!!selectedFolder && (
                <BillTable
                    handleSubmit={handleClose}
                    transactions={billsObj}
                    expenseCategories={expenseCategories}
                    handleSplit={handleSplit}
                />
            )}
            {!!selectedBill && openDialog && (
                <ExpenseForm
                    {...formData}
                    image={selectedBill.id}
                    mimeType={selectedBill.mimeType}
                    callback={handleClose}
                    handleClose={handleClose}
                    expenseCategories={expenseCategories}
                />
            )}
            {showLoader && (
                <div className="overlay">
                    <CircularProgress />
                </div>
            )}
        </div>
    );
}

// TODOS:
// Testing our logic
// Date Field Fix
// Online Transactions Update
