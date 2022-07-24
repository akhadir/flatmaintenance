const crypto = require('crypto');

global.crypto = {
    value: {
        getRandomValues: arr => crypto.randomBytes(arr.length),
    },
};
