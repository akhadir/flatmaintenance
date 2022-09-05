/* eslint-disable max-len */
import axios from 'axios';

const getData = (file: File) => {
    const formData = new FormData();
    formData.append('base64Image', file);
    axios
        .post('https://api.ocr.space/parse/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                apikey: 'K84187439488957',
            },
        })
        .then((response) => {
            console.log(response.data);
        }).catch((error) => {
            console.error(error);
        });
};

export default getData;
