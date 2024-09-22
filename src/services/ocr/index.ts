/* eslint-disable max-len */
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { getConfig } from '..';
import { copyFileAsDoc } from '../googleapis/drive-util';

const getOCRSpaceKey = () => getConfig().ocrSpaceKey || '';
const OCR_SPACE_API_URL = 'https://api.ocr.space/parse/image';
const OCR_SPACE_ENGINE = '5';

const getData = (file: File) => {
    const formData = new FormData();
    formData.append('base64Image', file);
    formData.append('isTable', 'true');
    formData.append('OCREngine', OCR_SPACE_ENGINE);
    axios
        .post(OCR_SPACE_API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                apikey: getOCRSpaceKey(),
            },
        })
        .then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
        });
};
export const getDriveVision = (fileId: string) => {
    copyFileAsDoc(fileId);
};

export const getVision = (imageURL: string) => {
    const formData = new FormData();
    formData.append('url', imageURL);
    formData.append('language', 'eng');
    // formData.append('isOverlayRequired', 'true');
    // formData.append('fileType', 'JPG');
    formData.append('isTable', 'true');
    formData.append('OCREngine', OCR_SPACE_ENGINE);
    formData.append('filetype', '.Auto');
    axiosRetry(axios, { retries: 3 });
    return axios
        .post(OCR_SPACE_API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                apikey: getOCRSpaceKey(),
            },
        }).catch((error) => {
            console.error(error);
        });
};
function dataURItoBlob(dataURI: string) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}
export const getDatafromDataURI = async (dataURI: string) => {
    const blob = dataURItoBlob(dataURI);
    const file = new File([blob], 'canvasImage.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('base64Image', file);
    const response = await axios
        .post(OCR_SPACE_API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                apikey: getOCRSpaceKey(),
            },
        });
    return response;
};

export default getData;
