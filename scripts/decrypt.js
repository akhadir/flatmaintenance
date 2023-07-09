const CryptoJS = require('crypto-js');

const eText = process.argv[2];
const secret = process.argv[3];
const text = CryptoJS.AES.decrypt(eText, secret).toString(CryptoJS.enc.Utf8);
console.log('Encrypted Text:', eText);
console.log('Decrypted Text:', text);
console.log('Encrypted Text:', eText);
