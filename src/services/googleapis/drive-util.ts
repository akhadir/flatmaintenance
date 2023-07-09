import axios from 'axios';
import { appConfig } from '..';

const folderId = '1zVRwXWZjfAS3Hk1rXq-XtqurPcQ-yAW-'; // bills directory

const apiKey = appConfig.googleAPIKey;

export default async function fetchFilesFromFolder() {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}'%20in%20parents&key=${apiKey}`,
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
