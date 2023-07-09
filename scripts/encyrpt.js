const CryptoJS = require('crypto-js');

const text = process.argv[2];
const secret = process.argv[3];
console.log('Text:', text);
const eText = CryptoJS.AES.encrypt(text, secret).toString();
console.log('Encrypted Text:', eText);
console.log('Decrypted Text:', CryptoJS.AES.decrypt(eText, secret).toString(CryptoJS.enc.Utf8));