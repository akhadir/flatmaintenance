/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Grid } from '@mui/material';
import { GoogleDriveFile } from './expense-types';

type FolderGridProp = { folders: GoogleDriveFile[]; handleClick:(folderId: string) => void };
const FolderGrid = ({ folders, handleClick }: FolderGridProp) => (
    <div>
        <Grid container spacing={2}>
            {folders.map((folder, index) => (
                <Grid item key={`Image ${index + 1}`} xs={2}>
                    <img
                        src="/images/folder.jpg"
                        id={`folder-${folder.name}`}
                        alt={`Folder ${index + 1}`}
                        style={{ width: 200, height: 200, cursor: 'pointer', padding: '5px' }}
                        onClick={() => handleClick(folder.id)}
                    />
                    <h3 style={{ textAlign: 'center' }}>{folder.name}</h3>
                </Grid>
            ))}
        </Grid>
    </div>
);

export default FolderGrid;
