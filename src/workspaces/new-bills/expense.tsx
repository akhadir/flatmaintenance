/* eslint-disable react/react-in-jsx-scope */
import React, { useCallback, useState } from 'react';
import moment from 'moment';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormHelperText,
    TextField,
    InputLabel,
    Select,
    DialogActions,
    Button,
    MenuItem,
} from '@mui/material';
import { ExpenseFormProps, ExpenseState } from './expense-types';
import './expense.css';
import { getDriveFileURL } from './bill-utils';

const ExpenseForm = ({
    callback, date, amount, description, category, image, handleClose, expenseCategories, mimeType, transactionType,
}: ExpenseFormProps) => {
    const [formData, setData] = useState<ExpenseState>({
        date: moment(date ?? '01-04-2023', 'DD-MM-YYYY').format('YYYY-MM-DD'),
        amount: amount ?? 0,
        description: description ?? 'text',
        category: category ?? '',
        transactionType,
    });

    const [errorData, setErrorData] = useState({
        date: '',
        amount: '',
        description: '',
        category: '',
        transactionType: '',
    });

    const handleChange = useCallback((event: any) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        let error = false;
        if (!formData.transactionType) {
            errorData.transactionType = 'Select a transaction type';
            error = true;
        }
        if (!formData.amount) {
            errorData.amount = 'Enter a valid amount';
            error = true;
        }
        if (!formData.date || formData.date.toLowerCase() === 'invalid date') {
            errorData.date = 'Enter a valid date';
            error = true;
        }
        if (!formData.description) {
            errorData.description = 'Enter a valid description';
            error = true;
        }
        if (!formData.category) {
            errorData.category = 'Select a category';
            error = true;
        }
        if (error) {
            setErrorData({ ...errorData });
        } else {
            const formDataClone = JSON.parse(JSON.stringify(formData));
            formDataClone.date = moment(formDataClone.date, 'YYYY-MM-DD').format('DD-MM-YYYY');
            callback(formDataClone);
        }
    }, [callback, errorData, formData]);

    return (
        <div className="expense-dialog">
            <Dialog open onClose={handleClose} className="bill-grid-dialog" fullWidth scroll="paper" maxWidth="xl">
                <DialogTitle>Form</DialogTitle>
                <DialogContent>
                    {mimeType.startsWith('image/') && (
                        <img
                            className="expense-bill-img"
                            src={getDriveFileURL(image)}
                            alt="Expense Bill"
                        />
                    )}
                    {mimeType === 'application/pdf' && (
                        <embed
                            className="expense-bill-img"
                            src={getDriveFileURL(image)}
                            title="Expense Bill"
                        />
                    )}
                    <form>
                        <FormControl variant="outlined" fullWidth margin="normal" error={!!errorData.transactionType}>
                            <RadioGroup
                                aria-label="Transaction Type"
                                name="transactionType"
                                value={formData.transactionType}
                                onChange={handleChange}
                                row
                            >
                                <FormControlLabel
                                    value="Cash"
                                    control={<Radio color="primary" />}
                                    label="Cash"
                                />
                                <FormControlLabel
                                    value="Online"
                                    control={<Radio color="primary" />}
                                    label="Online"
                                />
                            </RadioGroup>
                            {!!errorData.transactionType &&
                            <FormHelperText>{errorData.transactionType}</FormHelperText>
                            }
                        </FormControl>
                        <TextField
                            type="date"
                            name="date"
                            label="Date"
                            value={formData.date}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            placeholder="DD-MM-YYYY"
                            error={!!errorData.date}
                            helperText={errorData.date}
                        />
                        <TextField
                            type="number"
                            name="amount"
                            label="Amount"
                            value={formData.amount}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errorData.amount}
                            helperText={errorData.amount}
                        />
                        <TextField
                            type="text"
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                            error={!!errorData.description}
                            helperText={errorData.description}
                        />
                        <FormControl variant="outlined" fullWidth margin="normal" error={!!errorData.category}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                label="Category"
                            >
                                {expenseCategories.map((cat) => (
                                    <MenuItem key={cat.key} value={cat.key}>{cat.label}</MenuItem>
                                ))}
                            </Select>
                            {!!errorData.category && <FormHelperText>{errorData.category}</FormHelperText>}
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ExpenseForm;
