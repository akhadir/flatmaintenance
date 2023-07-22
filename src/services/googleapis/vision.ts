import axios from 'axios';
import { getConfig } from '..';

export function getVision(imageId: string) {
    const API_KEY = getConfig().googleAPIKey;
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
