/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Grid } from '@material-ui/core';
import { GoogleDriveFile } from './expense-types';
import { getDriveFileURL } from './bill-utils';
import './expense.css';

type BillGridType = {
    bills: GoogleDriveFile[];
    handleClick: (image: GoogleDriveFile) => void;
};

const BillGrid = ({ bills, handleClick }: BillGridType) => (
    <div>
        <Grid container spacing={2}>
            {bills.map((bill, index) => (
                <Grid
                    item
                    key={`Image ${index + 1}`}
                    xs={2}
                    className="bill-grid-item"
                    onClick={() => handleClick(bill)}
                >
                    {bill.mimeType.startsWith('image/') && (
                        <img
                            src={getDriveFileURL(bill.id)}
                            alt={`Bill ${index + 1}`}
                            style={{ width: 300, height: 300, cursor: 'pointer', padding: '5px' }}
                        />
                    )}
                    {bill.mimeType === 'application/pdf' && (
                        <embed
                            src={getDriveFileURL(bill.id)}
                            title={`Bill ${index + 1}`}
                            style={{ width: 300, height: 300, cursor: 'pointer', padding: '5px' }}
                            type="application/pdf"
                        />
                    )}
                    <h3 style={{ textAlign: 'center' }}>{bill.name}</h3>
                </Grid>
            ))}
            {bills.length === 0 && (<h4 className="no-bills-msg">No bills to display</h4>)}
        </Grid>
    </div>
);

export default BillGrid;
