import React, { useState } from 'react';
import { TextField, Typography, Container } from '@mui/material';
import { encrypt } from '../../services';

const EncryptKeyComponent = () => {
    const [key, setKey] = useState('');
    const [encryptedValue, setEncryptedValue] = useState('');

    const handleChange = (e: any) => {
        const newKey = e.target.value;
        setKey(newKey);
        setEncryptedValue(encrypt(newKey));
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Key Encryption
            </Typography>
            <TextField
                label="Enter Key"
                variant="outlined"
                fullWidth
                margin="normal"
                value={key}
                onChange={handleChange}
            />
            {encryptedValue && (
                <Typography variant="body1" marginTop="20px">
                    Encrypted Value: {encryptedValue}
                </Typography>
            )}
        </Container>
    );
};

export default EncryptKeyComponent;
