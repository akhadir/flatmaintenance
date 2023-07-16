import axios from 'axios';
import jwt from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import { appConfig } from '..';

const { clientEmail: clientId, privateKey, googleAPIKey: apiKey } = appConfig;
const email = '';

export const generateTokenAssertion = async (expiresIn = Math.floor(Date.now() / 1000 + 3600)) => {
    const claims = {
        iss: clientId,
        sub: email,
        aud: 'https://www.googleapis.com/oauth2/v4/token',
        scope: 'https://www.googleapis.com/auth/drive',
        exp: expiresIn,
        iat: Math.floor(Date.now() / 1000),
        jti: uuid(),
    };

    const token = jwt.sign(claims, privateKey || '', {
        algorithm: 'RS256',
    });

    return token;
};
export const generateAuthToken = async () => {
    const tokenAssertion = await generateTokenAssertion();
    const url = 'https://www.googleapis.com/oauth2/v4/token';
    const body = {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        client_id: clientId,
        assertion: tokenAssertion,
    };

    const response = await axios.post(url, body);

    if (response.status === 200) {
        return response.data.access_token;
    }
    throw new Error(response.data);
};

export default { generateToken: generateAuthToken, generateTokenAssertion };
