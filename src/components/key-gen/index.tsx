import React, { useCallback, useMemo, useState } from 'react';
import { TextField, Typography, Container, Box } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { decrypt, encrypt } from '../../services';
import './key.css';

const EncryptKeyComponent = () => {
    const [key, setKey] = useState('');
    const [encryptedValue, setEncryptedValue] = useState('');
    const [decryptedValue, setDecryptedValue] = useState('');
    const [copyMessage, setCopyMessage] = useState('');

    const handleChange = useCallback((e: any) => {
        const newKey = e.target.value;
        setKey(newKey);
        const eKey = encrypt(newKey);
        setEncryptedValue(eKey);
        setDecryptedValue(decrypt(eKey));
    }, []);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(encryptedValue);
        setCopyMessage('Encrypted value copied to clipboard!');
        setTimeout(() => {
            setCopyMessage('');
        }, 3000);
    }, [encryptedValue]);

    const decryptLabel = useMemo(() => {
        let out = <>Decrypted Value</>;
        if (key === decryptedValue) {
            out = <>Decrypted Value <CheckCircleRoundedIcon className="encrypt-check" /> </>;
        }
        return out;
    }, [decryptedValue, key]);

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
                <Box marginTop="20px">
                    <TextField
                        label="Encrypted Value"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={encryptedValue}
                        InputProps={{
                            readOnly: true,
                        }}
                        onClick={handleCopy}
                    />
                    {copyMessage && (
                        <Typography variant="body2" color="primary">
                            {copyMessage}
                        </Typography>
                    )}
                </Box>
            )}
            {decryptedValue && (
                <Box marginTop="20px">
                    <TextField
                        label={decryptLabel}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={decryptedValue}
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                </Box>
            )}
        </Container>
    );
};

export default EncryptKeyComponent;
