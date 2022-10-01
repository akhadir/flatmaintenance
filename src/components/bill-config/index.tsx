import React from 'react';
import './bills-config.css';

function BillConfig(props: any) {
    return (
        <div>
            <h3>Bill Config </h3>
            <form className="bills-config">
                {props.children}
            </form>
        </div>
    );
}

export default BillConfig;
