import { Input } from '@mui/material';
import React, { useState, useCallback } from 'react';

function FieldInput(props: any) {
    const [val, setVal] = useState(props.value);
    const onChange = useCallback((e: any) => {
        setVal(e.target.value);
    }, []);
    return (
        <Input {...props} value={val} onChange={onChange} />
    );
}

export default FieldInput;
