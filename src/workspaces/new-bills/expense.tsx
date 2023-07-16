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
} from '@material-ui/core';
import { ExpenseFormProps, ExpenseState } from './expense-types';
import './expense.css';

const ExpenseForm = ({
    callback, date, amount, description, category, image, handleClose,
}: ExpenseFormProps) => {
    const [formData, setData] = useState<ExpenseState>({
        date: moment(date ?? '01-04-2023', 'DD-MM-YYYY').format('YYYY-MM-DD'),
        amount: amount ?? 0,
        description: description ?? 'text',
        category: category ?? '',
    });

    const handleChange = useCallback((event: any) => {
        const { name, value } = event.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleSubmit = useCallback(() => {
        const formDataClone = JSON.parse(JSON.stringify(formData));
        formDataClone.date = moment(formDataClone.date, 'YYYY-MM-DD').format('DD-MM-YYYY');
        callback(formDataClone);
    }, [callback, formData]);

    return (
        <div className="expense-dialog">
            <Dialog open onClose={handleClose}>
                <DialogTitle>Form</DialogTitle>
                <DialogContent>
                    <img
                        className="expense-bill-img"
                        src={`https://drive.google.com/uc?id=${image}`}
                        alt="Expense Bill"
                    />
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
                            placeholder=""
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
                        />
                        <FormControl variant="outlined" fullWidth margin="normal">
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                label="Category"
                            >
                                <MenuItem value="food">Food</MenuItem>
                                <MenuItem value="travel">Travel</MenuItem>
                                <MenuItem value="shopping">Shopping</MenuItem>
                            </Select>
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
