/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import { Grid } from '@material-ui/core';

const ImageGrid = ({ images, handleClick }: { images: string[]; handleClick:(image: string) => void }) => (
    <div>
        <Grid container spacing={2}>
            {images.map((imageId, index) => (
                <Grid item key={`Image ${index + 1}`} xs={2}>
                    <img
                        src={`https://drive.google.com/uc?id=${imageId}`}
                        alt={`Image ${index + 1}`}
                        style={{ width: 300, height: 300, cursor: 'pointer', padding: '5px' }}
                        onClick={() => handleClick(imageId)}
                    />
                </Grid>
            ))}
        </Grid>
    </div>
);

export default ImageGrid;
