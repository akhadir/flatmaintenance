import React, { useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { fetchFilesFromFolder, moveFile } from '../../services/googleapis/drive-util';
import ImageGrid from './image-grid';
import ExpenseForm from './expense';
import { getVision } from '../../services/ocr';
import { ExpenseState, GoogleDriveFile } from './expense-types';
import { parseExpenseInfo } from '../../services/ocr/parser-utils';

export default function NewBills() {
    const [fileList, setFilesList] = useState<GoogleDriveFile[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [formData, setFormData] = useState<ExpenseState>({
        date: '',
        amount: 0,
        description: '',
        category: '',
    });
    const handleClick = useCallback((image: string) => {
        setSelectedImage(image);
        const fileInfo = fileList.find((file) => file.id === image);
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
            getVision(`https://drive.google.com/uc?id=${image}`).then((response: any) => {
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
        if (data) {
            const month = moment(data.date, 'DD-MM-YYYY').format('MMM');
            const monthFolder = fileList.find((file) => file.name === month);
            if (selectedImage && monthFolder) {
                moveFile(selectedImage, monthFolder.id).then(() => {
                    fetchFilesFromFolder().then((files) => {
                        setFilesList(files);
                    });
                    // TODO: Add or Update Transaction
                });
            }
        }
        setSelectedImage('');
        setOpenDialog(false);
    }, [fileList, selectedImage]);

    useEffect(() => {
        fetchFilesFromFolder().then((files) => {
            setFilesList(files);
        });
    }, []);

    const images = useMemo(() => fileList.filter(
        (file) => file.mimeType.startsWith('image/'))
        .map((file: any) => file.id), [fileList]);

    return (
        <>
            <h3>Unprocessed Bills</h3>
            <ImageGrid images={images} handleClick={handleClick} />
            {openDialog && (
                <ExpenseForm
                    {...formData}
                    image={selectedImage}
                    callback={handleClose}
                    handleClose={handleClose}
                />
            )}
        </>
    );
}
// Move the bill to corresponding month folder after processing
// Add or update Cash or online transaction with bills
// Handle PDF, if possible
