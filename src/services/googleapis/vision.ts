import axios from 'axios';
import { appConfig } from '..';

const API_KEY = appConfig.googleAPIKey;

export function getVision(imageId: string) {
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
    const data = {
        requests: [
            {
                image: {
                    // The image ID is the ID of the image saved in Google Drive.
                    source: {
                        imageUri: `https://drive.google.com/uc?id=${imageId}`,
                    },
                },
                features: [
                    {
                        type: 'TEXT_DETECTION',
                    },
                ],
            },
        ],
    };

    return axios.post(url, data).catch((error: any) => {
        console.error(error);
    });
}

export default { getVision };
