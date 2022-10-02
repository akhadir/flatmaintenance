import axios from 'axios';
import CryptoJS from 'crypto-js';
import store from '../redux/store';

export type KVPair = { key: string; value: string; };

export async function getImage(encBotId: string, fileId: string) {
    const state = store.getState();
    const { secret } = state.sheet.sheetConfig;
    const { fetchURL, downloadURL } = state.bills.config;
    const botId = CryptoJS.AES.decrypt(encBotId, secret).toString(CryptoJS.enc.Utf8);
    let replaceArray: KVPair[] = [
        {
            key: '{{botId}}',
            value: botId,
        },
        {
            key: '{{fileId}}',
            value: fileId,
        },
    ];
    let url = fetchURL;
    replaceArray.forEach((curr: KVPair) => {
        url = url.replace(curr.key, curr.value);
    });
    const imageData = await axios.get(url);
    const { photos } = imageData.data;
    const image = photos[photos.length - 1];
    replaceArray = [
        {
            key: '{{botId}}',
            value: botId,
        },
        {
            key: '{{filePath}}',
            value: image.filePath,
        },
    ];
    url = downloadURL;
    replaceArray.forEach((curr: KVPair) => {
        url = url.replace(curr.key, curr.value);
    });
    const resp = await axios.get(url);
    return resp.data;
}
