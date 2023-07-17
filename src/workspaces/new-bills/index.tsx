import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@material-ui/core';
import { VERIFIED_FILE_PREFIX, renameFile } from '../../services/googleapis/drive-util';
import ImageGrid from './image-grid';
import ExpenseForm from './expense';
import { getVision } from '../../services/ocr';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import { parseExpenseInfo } from '../../services/ocr/parser-utils';
import { fetchFiles } from './bill-utils';
import FolderGrid from './folder-grid';
import './new-bills.css';

export default function NewBills() {
    const [fileList, setFilesList] = useState<GoogleDriveFile[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedBill, setSelectedBill] = useState('');
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
    const handleClick = useCallback((image: GoogleDriveFile) => {
        setSelectedBill(image.id);
        const fileInfo = fileList.find((file) => file.id === image.id);
        const fileName = fileInfo?.name;
        let data: ExpenseState = {};
        if (fileName && fileName.indexOf('_') > -1) {
            data = parseExpenseInfo(fileName);
            setFormData({
                ...formData,
                ...data,
            });
        }
        if (!data.amount || !data.date || !data.description) {
            getVision(`https://drive.google.com/uc?id=${image.id}`).then((response: any) => {
                const parsedText = response.data?.ParsedResults[0]?.ParsedText || '';
                const parsedData = parseExpenseInfo(parsedText);
                parsedData.amount = data.amount && data.amount > 0 ? data.amount : parsedData.amount;
                parsedData.description = data.description || parsedData.description;
                parsedData.date = data.date ? data.date : parsedData.date;
                setFormData({
                    ...formData,
                    ...parsedData,
                });
            });
        }
        setOpenDialog(true);
    }, [fileList, formData]);

    const handleClose = useCallback((data?: ExpenseState) => {
        if (data?.date) {
            // const month = moment(data.date, 'DD-MM-YYYY').format('MMM');
            const fileInfo = fileList.find((file) => file.id === selectedBill);
            if (selectedBill && fileInfo) {
                renameFile(selectedBill, fileInfo.name).then(() => {
                    fetchFiles(setFilesList, selectedFolder);
                    // TODO: Add or Update Transaction
                });
            }
        }
        setSelectedBill('');
        setOpenDialog(false);
    }, [fileList, selectedBill, selectedFolder]);

    useEffect(() => {
        fetchFiles(setFilesList, selectedFolder);
    }, [selectedFolder]);

    const images = useMemo(() => fileList.filter(
        (file) => file.mimeType.startsWith('image/') && !file.name.startsWith(VERIFIED_FILE_PREFIX)), [fileList]);

    const folders = useMemo(() => fileList.filter(
        (file) => file.mimeType === 'application/vnd.google-apps.folder'), [fileList]);

    return (
        <>
            <h3>Unprocessed Bills</h3>
            {!!selectedFolder && (
                <Button
                    className="go-to-months-btn"
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedFolder('')}
                >
                    Go Back
                </Button>
            )}
            {!selectedFolder && <FolderGrid folders={folders} handleClick={handleFolderClick} />}
            {!!selectedFolder && <ImageGrid images={images} handleClick={handleClick} />}
            {openDialog && (
                <ExpenseForm
                    {...formData}
                    image={selectedBill}
                    callback={handleClose}
                    handleClose={handleClose}
                />
            )}
        </>
    );
}
