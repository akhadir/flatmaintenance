import React, { useEffect, useState } from 'react';
import {
    Box, TextField, Typography, Snackbar, Alert, Stack,
} from '@mui/material';

function Settings(): React.ReactElement {
    const [apiUrl, setApiUrl] = useState<string>('');
    const [secretKey, setSecretKey] = useState<string>('');
    const [saved, setSaved] = useState<boolean>(false);

    useEffect(() => {
        const existingApi = (window as any).OLLAMA_CHAT_API_URL ?? '';
        const existingKey = (window as any).SECRET_KEY ?? '';
        setApiUrl(existingApi);
        setSecretKey(existingKey);
    }, []);

    const updateApiUrl = (value: string) => {
        setApiUrl(value);
        (window as any).OLLAMA_CHAT_API_URL = value;
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    const updateSecretKey = (value: string) => {
        setSecretKey(value);
        (window as any).SECRET_KEY = value;
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    };

    const handleClose = () => setSaved(false);

    return (
        <Box
            maxWidth={600}
            sx={{
                p: 2,
                mx: 'auto', // centers horizontally
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant="h5" gutterBottom sx={{ alignSelf: 'flex-start' }}>
                Settings
            </Typography>

            <Box width="100%">
                <Stack spacing={2}>
                    <TextField
                        label="OLLAMA CHAT API URL"
                        value={apiUrl}
                        onChange={(e) => updateApiUrl(e.target.value)}
                        placeholder="https://example.com"
                        fullWidth
                        variant="outlined"
                    />

                    {/* <TextField
                        label="ENCRYPTION KEY"
                        value={secretKey}
                        onChange={(e) => updateSecretKey(e.target.value)}
                        placeholder="encryption key"
                        fullWidth
                        variant="outlined"
                    /> */}
                </Stack>
            </Box>

            <Snackbar
                open={saved}
                autoHideDuration={1500}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Settings saved to window object
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default Settings;
