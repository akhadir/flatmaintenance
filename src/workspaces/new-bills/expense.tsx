/* eslint-disable react/react-in-jsx-scope */
import React, { useCallback, useState } from 'react';
import moment from 'moment';
import {
    Dialog,
    Select,
    Button,
    MenuItem,
    InputLabel,
    DialogContent,
    DialogTitle,
    FormControl,
    DialogActions,
    TextField,
    FormHelperText,
} from '@material-ui/core';
import { ExpenseFormProps, ExpenseState } from './expense-types';
import './expense.css';

const ExpenseForm = ({
    callback, date, amount, description, category, image, handleClose, expenseCategories, mimeType,
}: ExpenseFormProps) => {
    const [formData, setData] = useState<ExpenseState>({
        date: moment(date ?? '01-04-2023', 'DD-MM-YYYY').format('YYYY-MM-DD'),
        amount: amount ?? 0,
        description: description ?? 'text',
        category: category ?? '',
    });

    const [errorData, setErrorData] = useState({
        date: '',
        amount: '',
        description: '',
        category: '',
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
            <Dialog open onClose={handleClose}>
                <DialogTitle>Form</DialogTitle>
                <DialogContent>
                    {mimeType.startsWith('image/') && (
                        <img
                            className="expense-bill-img"
                            src={`https://drive.google.com/uc?id=${image}`}
                            alt="Expense Bill"
                        />
                    )}
                    {mimeType === 'application/pdf' && (
                        <embed
                            className="expense-bill-img"
                            src={`https://drive.google.com/uc?id=${image}`}
                            title="Expense Bill"
                        />
                    )}
                    <form>
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
