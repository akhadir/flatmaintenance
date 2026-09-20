/* eslint-disable max-len */
import axios from 'axios';
import { getConfig } from '../index';

export type ProcessedData = {
    amount: number;
    date: string;
    description: string;
    isChequeIssued: boolean;
};

export class NVIDIA {
    private apiKey: string;
    private apiUrl: string;

    public constructor() {
        // Get configuration
        const config = getConfig();
        this.apiKey = config.nvidiaKey || '';
        this.apiUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';
    }

    public async initChat(msg?: string): Promise<void> {
        // For NVIDIA NIM, we don't need to initialize a chat session in the same way
        // The initialization is handled per request with system prompt

        // We'll just validate that we have an API key
        if (!this.apiKey) {
            throw new Error('NVIDIA API key not configured');
        }
    }

    public async extractData(text: string): Promise<ProcessedData> {
        try {
            // Validate API key
            if (!this.apiKey) {
                throw new Error('NVIDIA API key not configured');
            }

            // Prepare the request to NVIDIA's OpenAI-compatible chat completions API
            const requestData = {
                model: 'nvidia/nemotron-3-super-120b-a12b',
                messages: [
                    {
                        role: 'system',
                        content: this.getSystemPrompt(),
                    },
                    {
                        role: 'user',
                        content: text,
                    },
                ],
                max_tokens: 512,
                temperature: 0.2,
                top_p: 0.95,
                stream: false,
            };

            // Make request to NVIDIA NIM API
            const response = await axios.post(
                this.apiUrl,
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    timeout: 30000,
                },
            );

            // Extract the generated text from the response
            const generatedText = response.data.choices?.[0]?.message?.content || '';

            // Parse the JSON response from the AI
            // Clean the response to extract JSON
            const cleanedText = generatedText
                .replace(/```(?:json)?/g, '')
                .replace(/```/g, '')
                .trim();

            // Try to find JSON object in the response
            const jsonMatch = cleanedText.match(/{[\s\S]}/);
            const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;

            let parsedData;
            try {
                parsedData = JSON.parse(jsonString);
            } catch (parseError) {
                console.warn('Failed to parse JSON from AI response:', generatedText);
                // Fallback: try to extract values using regex
                parsedData = this.extractValuesFromText(generatedText);
            }

            // Ensure we have the required fields with proper types
            return {
                date: String(parsedData?.date || parsedData?.Date || ''),
                description: String(parsedData?.description || parsedData?.Description || ''),
                amount: Number(parsedData?.amount || parsedData?.Amount || 0),
                isChequeIssued: Boolean(parsedData?.isChequeIssued || parsedData?.IsChequeIssued || false),
            };
        } catch (e) {
            console.error('Error in NVIDIA data extraction:', e);
            // Return default values on error
            return { amount: 0, date: '', description: '', isChequeIssued: false };
        }
    }

    private getSystemPrompt(): string {
        return 'You are a bill/receipt data extractor. You have to extract the date (dd-mm-YYYY), amount (in number format), description (in short) and isChequeIssued (is cheque issued?). Expect the following date formats as input \'dd-mm-YYYY\', \'dd-mm-YY\', \'dd/mm/YYYY\' and \'dd/mm/YY\'. Also sometimes date delimiter has been misinterpreted as numerical one. Ex. 25/7124 can be interpreted as 25/7/24 which is of format, \'dd/mm/YY\'. Also expect multiple numbers, provide the largest number as amount. Don\'t expect amount to be larger than 6 digits. Also expect the whole input in tabular format separated by newlines and tabs. The whole data is a bill information. If it is electricity bill, Description should be \'Electricity bill\'. If it is a BWSSB or Water bill, the description should be BWSSB. Don\'t use text having word \'Total\' as description. If input is a bill of items purchased, find the reason like \'Motor repair\'. If not found, say \'Items Purchased\' followed by a line item.';
    }

    public extractValuesFromText(text: any): any {
        const result: any = {};

        // Extract date (looking for date patterns)
        // eslint-disable-next-line no-useless-escape
        const dateMatch = text?.match(/\d{2}[\/\-]\d{2}[\/\-]\d{2,4}/);
        if (dateMatch) {
            [result.date] = dateMatch;
        }

        // Extract amount (look for numbers, potentially with decimals)
        const amountMatch = text?.match(/(?:amount|total|sum|total\s+amount)[:\s]*[$₹£€]?\s*(\d+(?:\.\d{1,2})?)/i);
        if (amountMatch) {
            result.amount = parseFloat(amountMatch[1]);
        } else {
            // Find all numbers and take the largest one (as per original logic)
            const numbers = text?.match(/\d+(?:\.\d+)?/g) || [];
            const validNumbers = numbers
                .map(Number)
                .filter((n: number) => !Number.isNaN(n) && n <= 999999); // Max 6 digits
            if (validNumbers.length > 0) {
                result.amount = Math.max(...validNumbers);
            }
        }

        // Extract description (look for common bill types or text after labels)
        const descPatterns = [
            /(?:description|desc|details?)[:\s]*([^\n\r.]+)/i,
            /(?:electricity|electric|power|hydro|bwssb|water)[^\n\r.]/i,
            /(?:items?\s+purchased|items?|products?)[^\n\r.]/i,
        ];

        const matches = descPatterns.map((pattern: RegExp) => text?.match(pattern));
        let matched = null;
        let i = 0;
        while (i < matches.length && !matched) {
            if (matches[i] !== null) {
                matched = matches[i];
            }
            i += 1;
        }
        if (matched) {
            result.description = matched[0].trim();
        }

        // If no description found, use a default
        if (!result.description) {
            result.description = 'Items Purchased';
        }

        // Extract check/check issued status
        const checkMatch = text?.match(/(?:check|cheque).*?(?:issued?|paid?|yes|no)/i);
        if (checkMatch) {
            const checkStr = (checkMatch[0] as string).toLowerCase();
            result.isChequeIssued =
                checkStr.includes('yes') ||
                checkStr.includes('issued') ||
                checkStr.includes('paid');
        }

        return result;
    }

    static instance: NVIDIA;

    static getInstance() {
        if (!NVIDIA.instance) {
            NVIDIA.instance = new NVIDIA();
        }
        return NVIDIA.instance;
    }
}

// Default export for one-time usage (similar to Gemini)
export default async function extractData(text: string): Promise<ProcessedData> {
    try {
        const config = getConfig();
        const apiKey = config.nvidiaKey || '';
        const apiUrl = 'https://integrate.api.nvidia.com/v1/chat/completions';

        if (!apiKey) {
            throw new Error('NVIDIA API key not configured');
        }

        // Prepare the request to NVIDIA's OpenAI-compatible chat completions API
        const requestData = {
            model: 'nvidia/nemotron-3-super-120b-a12b',
            messages: [
                {
                    role: 'system',
                    content: 'You are a bill/receipt data extractor. You have to extract the date (dd-mm-YYYY), amount (in number format), description (in short) and isChequeIssued (is cheque issued?). Expect the following date formats as input \'dd-mm-YYYY\', \'dd-mm-YY\', \'dd/mm/YYYY\' and \'dd/mm/YY\'. Also sometimes date delimiter has been misinterpreted as numerical one. Ex. 25/7124 can be interpreted as 25/7/24 which is of format, \'dd/mm/YY\'. Also expect multiple numbers, provide the largest number as amount. Don\'t expect amount to be larger than 6 digits. Also expect the whole input in tabular format separated by newlines and tabs. The whole data is a bill information. If it is electricity bill, Description should be \'Electricity bill\'. If it is a BWSSB or Water bill, the description should be BWSSB. Don\'t use text having word \'Total\' as description. If input is a bill of items purchased, find the reason like \'Motor repair\'. If not found, say \'Items Purchased\' followed by a line item.',
                },
                {
                    role: 'user',
                    content: text,
                },
            ],
            max_tokens: 512,
            temperature: 0.2,
            top_p: 0.95,
            stream: false,
        };

        // Make request to NVIDIA NIM API
        const response = await axios.post(
            apiUrl,
            requestData,
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                timeout: 30000,
            },
        );

        // Extract the generated text from the response
        const generatedText = response.data.choices?.[0]?.message?.content || '';

        // Parse the JSON response from the AI
        // Clean the response to extract JSON
        const cleanedText = generatedText
            .replace(/```(?:json)?/g, '')
            .replace(/```/g, '')
            .trim();

        // Try to find JSON object in the response
        const jsonMatch = cleanedText.match(/{[\s\S]}/);
        const jsonString = jsonMatch ? jsonMatch[0] : cleanedText;

        let parsedData;
        try {
            parsedData = JSON.parse(jsonString);
        } catch (parseError) {
            console.warn('Failed to parse JSON from AI response:', generatedText);
            // Create a temporary instance to use the fallback method
            const tempInstance = new NVIDIA();
            parsedData = tempInstance.extractValuesFromText(generatedText);
        }

        // Ensure we have the required fields with proper types
        return {
            date: String(parsedData?.date || parsedData?.Date || ''),
            description: String(parsedData?.description || parsedData?.Description || ''),
            amount: Number(parsedData?.amount || parsedData?.Amount || 0),
            isChequeIssued: Boolean(parsedData?.isChequeIssued || parsedData?.IsChequeIssued || false),
        };
    } catch (e) {
        console.error('Error in NVIDIA data extraction:', e);
        // Return default values on error
        return { amount: 0, date: '', description: '', isChequeIssued: false };
    }
}
