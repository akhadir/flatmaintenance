import React from 'react';
import './field.css';

export type FieldProps = {
    label: string;
    name: string;
    mandatory?: boolean;
    children?: any;
    errors?: string[];
    onBlur: (e: any) => void;
}
function Field(props: FieldProps) {
    const {
        name, label, children, errors, mandatory,
    } = props;
    return (
        <div className="form-control">
            <label htmlFor={name}>{label}:{!!mandatory && <span className="mandatory">*</span>}</label>
            {children}
            <div className="error" id={`help-${name}`}>
                {!!errors && errors.map((err) => <p>{err}</p>)}
            </div>
        </div>
    );
}

export default Field;
