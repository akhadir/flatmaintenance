/* eslint-disable max-len */
import { TransCategory } from '../../utils/trans-category';
import PDFToImagesConverter from '../pdf-to-image';

type RequestRedirect = 'follow' | 'error' | 'manual'

// const LLAVA_LLAMA_MODEL = 'llava-llama3';
const GEMMA3_MODEL = 'gemma3:latest';
const QWEN25_3B_MODEL = 'qwen2.5:3b';
const LLM_MODEL = GEMMA3_MODEL;

export type OllamaApiResponse = {
    model: string;
    created_at: string;
    message: {
      role: string;
      content: string;
    };
    done_reason: string;
    done: boolean;
    total_duration: number;
    load_duration: number;
    prompt_eval_count: number;
    prompt_eval_duration: number;
    eval_count: number;
    eval_duration: number;
  };
const Ollama = {
    getVision: async (imageURL: string): Promise<OllamaApiResponse | null> => {
        const body = await Ollama.getVisionRequestBody(imageURL);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body),
            redirect: 'follow' as RequestRedirect,
        };
        try {
            const response = await fetch('http://localhost:11434/api/chat', requestOptions);
            console.log(response);
            return response.json();
        } catch (error) {
            console.error('Error fetching vision:', error);
            return null;
        }
    },
    getCategory: async (data: any): Promise<OllamaApiResponse | null> => {
        const categoryList = Object.values(TransCategory);
        const body = await Ollama.getCatRequestBody(data, categoryList);
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(body),
            redirect: 'follow' as RequestRedirect,
        };
        try {
            const response = await fetch('http://localhost:11434/api/chat', requestOptions);
            console.log(response);
            return response.json();
        } catch (error) {
            console.error('Error fetching vision:', error);
            return null;
        }
    },
    getCatRequestBody: async(data: string, categoryList: string[]) => {
        const categories = categoryList.join(', ');
        return {
            model: QWEN25_3B_MODEL,
            messages: [
                {
                    role: 'system', // "system" is a prompt to define how the model should act.
                    content: 'You are categorizer of bills. Your output should be in JSON format. { category: string }',
                },
                {
                    role: 'user', // "user" is a prompt provided by the user.
                    content: `Followng is the list of categories.
${categories}
Based the following description of the bill, figure out the category.
Description: ${data}`,
                },
            ],
            stream: false, // returns as a full message rather than a streamed response
        };
    },
    getVisionRequestBody: async (imageURL: string) => {
        const categories = Object.values(TransCategory).join(', ');
        const dataURIs: string[] = [];
        const dataURI: string = await Ollama.urlToBase64(imageURL) as string;
        if (dataURI.startsWith('data:application/pdf;base64,')) {
            const converter = new PDFToImagesConverter();
            const pdfImages: any = await converter.convert(imageURL);
            if (pdfImages?.length) {
                const base64Images: any[] = await Promise.all(
                    pdfImages.map(async (img: string) => {
                        const imageURI = img.replace(/data:.+;base64,/, '');
                        // console.log('Image URI: ', img);
                        return imageURI;
                    }),
                );
                dataURIs.push(...base64Images);
            }
        } else {
            console.log('Data URI: ', dataURI);
            dataURIs.push(dataURI.replace(/data:.+;base64,/, ''));
        }
        return {
            model: LLM_MODEL,
            stream: false,
            options: {
                seed: 101,
                temperature: 0.1,
            },
            format: {
                type: 'object',
                properties: {
                    date: {
                        type: 'string',
                    },
                    description: {
                        type: 'string',
                    },
                    amount: {
                        type: 'integer',
                    },
                    cash: {
                        type: 'boolean',
                    },
                    category: {
                        type: 'string',
                    },
                },
                required: [
                    'date',
                    'amount',
                    'cash',
                    'description',
                ],
            },
            messages: [
                {
                    role: 'user',
                    content: `What text do you read in this image? Fetch data like Amount, Date, is Cash or Cheque transaction and Description.
Default is cash transaction unless the word 'cheque' found.
Date: Date format should be 'dd/mm/yyyy'. If the year is not found, use the current year. If day is not found, use '01' as day. If month is not found, use '03' as month.
Followng is the list of categories. ${categories}
Figure out the category based on the image input.`,
                },
                {
                    role: 'user',
                    images: dataURIs,
                },
            ],
        };
    },
    urlToBase64: async (imageUrl: string) => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            const blob = await response.blob();
            return await Ollama.blobToBase64(blob);
        } catch (error) {
            console.error('Error converting URL to Base64:', error);
            throw error;
        }
    },
    blobToBase64: (blob: Blob) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
    }),

};

export default Ollama;
