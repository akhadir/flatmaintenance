/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Grid } from '@material-ui/core';
import { GoogleDriveFile } from './expense-types';
import './expense.css';

type ImageGridType = {
    images: GoogleDriveFile[];
    handleClick: (image: GoogleDriveFile) => void;
};

const ImageGrid = ({ images, handleClick }: ImageGridType) => (
    <div>
        <Grid container spacing={2}>
            {images.map((image, index) => (
                <Grid item key={`Image ${index + 1}`} xs={2} className="bill-grid-item">
                    <img
                        src={`https://drive.google.com/uc?id=${image.id}`}
                        alt={`Image ${index + 1}`}
                        style={{ width: 300, height: 300, cursor: 'pointer', padding: '5px' }}
                        onClick={() => handleClick(image)}
                    />
                    <h3 style={{ textAlign: 'center' }}>{image.name}</h3>
                </Grid>
            ))}
            {images.length === 0 && (<h4 className="no-bills-msg">No bills to display</h4>)}
        </Grid>
    </div>
);

export default ImageGrid;
