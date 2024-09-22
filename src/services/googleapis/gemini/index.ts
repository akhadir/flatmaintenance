import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';
import { getConfig } from '../../index';

export type ProcessedData = {
    amount: number;
    date: string;
    description: string;
    isCheckIssued: boolean;
}
export default async function extractData(text: string) : Promise<ProcessedData> {
    const MODEL_NAME = 'gemini-1.0-pro';
    const API_KEY = getConfig().geminiKey || '';
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 0.9,
        topK: 0,
        topP: 1,
        maxOutputTokens: 2048,
    };

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const chat = model.startChat({
        generationConfig,
        safetySettings,
    });
    try {
        // eslint-disable-next-line max-len
        const result = await chat.sendMessage(`What is the date (dd-mm-YYYY), amount (in number format), description (in short) and isChequeIssued (is cheque issued?)', extracted from the following text in JSON format?\n${text}`);
        const { response } = result;
        const parsedString = response.text().replace(/```/g, '').replace(/JSON/gi, '');
        const parsedData = JSON.parse(parsedString);
        return Array.isArray(parsedData) ? parsedData[0] : parsedData;
    } catch (e) {
        console.log(e);
    }
    return { amount: 0, date: '', description: '', isCheckIssued: false };
}
