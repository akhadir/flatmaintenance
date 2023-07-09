import axios from 'axios';
import { appConfig } from '..';

const folderId = '1zVRwXWZjfAS3Hk1rXq-XtqurPcQ-yAW-'; // bills directory

// eslint-disable-next-line max-len
const query = encodeURI(`'${folderId}' in parents and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.folder')`);
const apiKey = appConfig.googleAPIKey;

export default async function fetchFilesFromFolder() {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}`,
        );

        const { files } = response.data;
        console.log('Fetched files:', files);
        // Do something with the fetched files
    } catch (error: any) {
        console.error('Error fetching files:', error?.message || error);
    }
}

// Call the function with the folder ID
// fetchFilesFromFolder();
