import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import Slide from '@material-ui/core/Slide';
// import { TransitionProps } from '@material-ui/core/transitions';

// const Transition = React.forwardRef((
//     props: TransitionProps & { children?: React.ReactElement<any, any> },
//     ref: React.Ref<unknown>,
// ) => <Slide direction="up" ref={ref} {...props} />);

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
                <Input type="password" value={secret} onChange={handleChange} />
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
