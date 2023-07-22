import { Configuration, OpenAIApi } from 'openai';
import { getConfig } from '..';
import { ApplicationConfig } from '../service-types';

export class ChatGPTService {
    public chatGPTPrivateKey: string = '';
    public openAI: OpenAIApi | undefined;
    private appConfig: ApplicationConfig;

    public constructor() {
        this.appConfig = getConfig();
        if (this.appConfig.chatGPTPrivateKey) {
            this.chatGPTPrivateKey = this.appConfig.chatGPTPrivateKey;
            const chatGPTConfig = new Configuration({
                organization: 'org-wfOq673LgvxydlfXwY3Fmcvm',
                apiKey: this.chatGPTPrivateKey,
            });
            this.openAI = new OpenAIApi(chatGPTConfig);
        }
    }

    public async getCompleted(text: string) {
        if (this.openAI) {
            return this.openAI.createCompletion({
                model: 'text-davinci-003',
                prompt: 'Say this is a test',
                max_tokens: 7,
                temperature: 0,
                top_p: 1,
                n: 1,
                stream: false,
                logprobs: null,
                stop: '\n',
            },
            );
        }
        return Promise.resolve('');
    }

    static instance: ChatGPTService;

    static getInstance() {
        if (!ChatGPTService.instance) {
            ChatGPTService.instance = new ChatGPTService();
        }
        return ChatGPTService.instance;
    }
}

export default ChatGPTService;
