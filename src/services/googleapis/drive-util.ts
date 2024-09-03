import axios from 'axios';
import { getConfig } from '..';
import { generateAuthToken } from './google-token';

export const VERIFIED_FILE_PREFIX = 'VERIFIED_';
const BILLS_FOLDER_ID = '1-6owJyxGQSwRKxcJyMI3NXY4v-APeBui'; // bills directory

export async function fetchFilesFromFolder(folderId: string): Promise<any[]> {
    const { googleAPIKey: apiKey } = getConfig();
    const folderIdFinal = folderId || BILLS_FOLDER_ID;
    // eslint-disable-next-line max-len
    const query = encodeURI(`'${folderIdFinal}' in parents and (mimeType = 'image/jpeg' or mimeType = 'image/png' or mimeType = 'application/pdf' or mimeType = 'application/vnd.google-apps.folder')`);
    try {
        const response = await axios.get(
            `https://www.googleapis.com/drive/v3/files?q=${query}&key=${apiKey}`,
        );

        const { files } = response.data;
        console.log('Fetched files:', files);
        return files;
    } catch (error: any) {
        console.error('Error fetching files:', error?.message || error);
    }
    return [];
}

export async function copyFileAsDoc(fileId: string): Promise<any> {
    const { googleAPIKey: apiKey } = getConfig();
    try {
        const response = await axios.post(
            `https://www.googleapis.com/drive/v3/files/${fileId}/copy?key=${apiKey}`,
            {
                convert: true,
                ocr: true,
            },
        );
        console.log('Copied File:', response);
        return response;
    } catch (error: any) {
        console.error('Error fetching files:', error?.message || error);
    }
    return {};
}

export const moveFile = async (fileId: string, toDirectoryId: string) => {
    try {
        const authToken = await generateAuthToken();
        const response = await axios.patch(
            `https://www.googleapis.com/drive/v3/files/${fileId}`,
            {
                parents: toDirectoryId,
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

export const renameFile = async (fileId: string, name: string) => {
    try {
        const authToken = await generateAuthToken();
        const response = await axios.patch(
            `https://www.googleapis.com/drive/v3/files/${fileId}`,
            {
                name: `${VERIFIED_FILE_PREFIX}${name}`,
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
