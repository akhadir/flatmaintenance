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
    isChequeIssued: boolean;
}

export class Gemini {
    private readonly chat;
    private inProgress = false;
    private initProm: Promise<any> | undefined;

    public constructor() {
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
        // eslint-disable-next-line max-len, quotes
        const systemInstruction = `You are a bill/receipt data extractor. You have to extract the date (dd-mm-YYYY), amount (in number format), description (in short) and isChequeIssued (is cheque issued?). Expect the following date formats as input 'dd-mm-YYYY', 'dd-mm-YY', 'dd/mm/YYYY' and 'dd/mm/YY'. Also sometimes date delimter has been miss-interperated as numberical one. Ex. 25/7124 can be interperated as 25/7/24 which is of format, 'dd/mm/YY'. Also expect multiple numbers, provide the largest number as amount. Don't expect amount to be larger than 6 digits. Also expect the whole input in tabular format separated by newlines and tabs. The whole data is a bill information. If it is electricity bill, Description should be 'Electricity bill'. If it is a BWSSB or Water bill, the description should be BWSSB. Don't use text havig word 'Total' as description. If input is a bill of items purchased, find the reason like 'Motor repair'. If not found, say 'Items Purchased' followed by a line item.`;
        this.chat = model.startChat({
            generationConfig,
            safetySettings,
            // systemInstruction, // This option is not working as expected
        });
        this.initChat(systemInstruction);
    }

    public async initChat(msg?: string) {
        this.inProgress = true;
        const message = `Following is the context for future chat messages.\n${msg}`;
        this.initProm = this.chat.sendMessage(message);
    }

    public async extractData(text: string) : Promise<ProcessedData> {
        if (this.inProgress) {
            await this.initProm;
            this.inProgress = false;
        }
        try {
            // eslint-disable-next-line max-len
            const result = await this.chat.sendMessage(`What is the date (dd-mm-YYYY), amount (in number format), description (in short) and isChequeIssued (is cheque issued?)', extracted from the following text (comes after new line) in JSON format?\n${text}`);
            const { response } = result;
            const parsedString = response.text().replace(/```/g, '').replace(/JSON/gi, '');
            const parsedData = JSON.parse(parsedString);
            const data = Array.isArray(parsedData) ? parsedData[0] : parsedData;
            return {
                date: data.date || data.Date,
                description: data.description || data.Description,
                amount: data.amount || data.Amount,
                isChequeIssued: typeof data.isChequeIssued !== 'undefined' ? data.isChequeIssued : data.IsChequeIssued,
            };
        } catch (e) {
            console.log(e);
        }
        return { amount: 0, date: '', description: '', isChequeIssued: false };
    }

    static instance: Gemini;

    static getInstance() {
        if (!Gemini.instance) {
            Gemini.instance = new Gemini();
        }
        return Gemini.instance;
    }
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
    // const systemInstruction = 'You are a bill data extractor. Extract the data and output it in JSON Format';
    const chat = model.startChat({
        generationConfig,
        safetySettings,
        // systemInstruction, // This option is not working as expected
    });
    try {
        // eslint-disable-next-line max-len
        const result = await chat.sendMessage(`What is the date (dd-mm-YYYY), amount (in number format), description (in short) and isChequeIssued (is cheque issued?)', extracted from the following text (comes after new line) in JSON format? Expect the following date formats as input 'dd-mm-YYYY', 'dd-mm-YY', 'dd/mm/YYYY' and 'dd/mm/YY'. Also sometimes date delimter has been miss-interperated as numberical one. Ex. 25/7124 can be interperated as 25/7/24 which is of format, 'dd/mm/YY'. Also expect multiple numbers, provide the largest number as amount. Don't expect amount to be larger than 6 digits. Also expect the whole input in tabular format separated by newlines and tabs. The whole data is a bill information. If it is electricity bill, Description should be 'Electricity bill'. If it is a BWSSB or Water bill, the description should be BWSSB. Don't use text havig word 'Total' as description. If input is a bill of items purchased, find the reason like 'Motor repair'. If not found, say 'Items Purchased' followed by a line item. Text Goes here.\n${text}`);
        const { response } = result;
        const parsedString = response.text().replace(/```/g, '').replace(/JSON/gi, '');
        const parsedData = JSON.parse(parsedString);
        return Array.isArray(parsedData) ? parsedData[0] : parsedData;
    } catch (e) {
        console.log(e);
    }
    return { amount: 0, date: '', description: '', isChequeIssued: false };
}
