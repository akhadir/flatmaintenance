import React from 'react';
import { fetchFilesFromFolder } from '../../services/googleapis/drive-util';
import { GoogleDriveFile } from './expense-types';

export function fetchFiles(
    setFilesList: React.Dispatch<React.SetStateAction<GoogleDriveFile[]>>,
    folderId: string = '',
) {
    fetchFilesFromFolder(folderId).then((files) => {
        setFilesList(files);
    });
}

export default { fetchFiles };
