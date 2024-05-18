import React from 'react';
import { Grid } from '@mui/material';
import { GoogleDriveFile } from './expense-types';

type FolderGridProp = { folders: GoogleDriveFile[]; handleClick:(folderId: string) => void };
const FolderGrid = ({ folders, handleClick }: FolderGridProp) => {
    const sortedFolders = folders.length ? customSortByMonth(folders) : [];
    return (
        <div>
            <Grid container spacing={2}>
                {sortedFolders.map((folder, index) => (
                    <Grid item key={`Image ${index + 1}`} xs={2} onClick={() => handleClick(folder.id)}>
                        <img
                            src="/images/folder.jpg"
                            id={`folder-${folder.name}`}
                            alt={`Folder ${index + 1}`}
                            style={{ width: 200, height: 200, cursor: 'pointer', padding: '5px' }}
                        />
                        <h3 style={{ textAlign: 'center' }}>{folder.name}</h3>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

function customSortByMonth(arr: GoogleDriveFile[]) {
    const monthMap: any = {
        APR: 1,
        MAY: 2,
        JUN: 3,
        JUL: 4,
        AUG: 5,
        SEP: 6,
        OCT: 7,
        NOV: 8,
        DEC: 9,
        JAN: 10,
        FEB: 11,
        MAR: 12,
    };

    // Custom sort function
    arr.sort((a: GoogleDriveFile, b: GoogleDriveFile) => {
        const monthA = monthMap[a.name.toUpperCase()];
        const monthB = monthMap[b.name.toUpperCase()];
        return monthA - monthB;
    });

    return arr;
}

export default FolderGrid;
