import React, { useCallback } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, Input, DialogActions, Button,
} from '@mui/material';

export type SecretDialogProps = {
    errorMsg?: string;
    handleSecret: (secret: string) => void;
}
export default function SecretDialog(props: SecretDialogProps) {
    const [open, setOpen] = React.useState(true);
    const [secret, setSecret] = React.useState('');
    const handleOk = useCallback(() => {
        // setOpen(false);
        props.handleSecret(secret);
    }, [props, secret]);
    const handleChange = useCallback((e: any) => {
        setSecret(e.target.value);
    }, []);
    const handleEnter = useCallback((e: any) => {
        const ENTER_KEYCODE = 13;
        const keyCode = e.keyCode ? e.keyCode : e.which;
        if (keyCode === ENTER_KEYCODE) {
            props.handleSecret(secret);
        }
    }, [props, secret]);
    return (
        <Dialog
            open={open}
            keepMounted
            aria-labelledby="Secret Key"
            aria-describedby="Enter your secret key"
        >
            <DialogTitle id="alert-dialog-slide-title">Enter the secret key!!!</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    Check with other committee members, if secret key is not known.
                </DialogContentText>
                <Input type="password" value={secret} onChange={handleChange} onKeyPress={handleEnter} />
                <div className="error">{props.errorMsg}</div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleOk} disabled={!secret} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
