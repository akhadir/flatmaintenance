import axios from 'axios';
import { appConfig } from '..';
import { generateAuthToken } from './google-token';

const folderId = '1zVRwXWZjfAS3Hk1rXq-XtqurPcQ-yAW-'; // bills directory
const { googleAPIKey: apiKey } = appConfig;
// eslint-disable-next-line max-len
const query = encodeURI(`'${folderId}' in parents and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.folder')`);

export async function fetchFilesFromFolder(): Promise<any[]> {
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}`,
        );

        const { files } = response.data;
        console.log('Fetched files:', files);
        return files;
        // Do something with the fetched files
    } catch (error: any) {
        console.error('Error fetching files:', error?.message || error);
    }
    return [];
}

export const moveFile = async (fileId: string, toDirectoryId: string) => {
    try {
        const authToken = await generateAuthToken();
        const response = await axios.patch(
            `https://www.googleapis.com/drive/v3/files/${fileId}`,
            {
                addParents: toDirectoryId,
                removeParents: folderId,
                fields: 'id, parents',
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('File moved successfully:', response.data);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error occurred while moving the file:', error);
    }
    return null;
};

export default { fetchFilesFromFolder, moveFile };
