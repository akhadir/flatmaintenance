/* eslint-disable max-len */
// import { HfInference } from '@huggingface/inference';
const HfInference = require('@huggingface/inference');

export const getImageRes1 = async () => {
    const hf = new HfInference.HfInference('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');
    const resp = await hf.documentQuestionAnswering({
        model: 'impira/layoutlm-document-qa',
        inputs: {
            question: 'What is the date of the bill?',
            image: await (
                await fetch(
                    'https://drive.google.com/uc?id=1xnDte3ACls6kN43hyke4SN5VNWE84Frb',
                )).blob(),
        },
    });
    console.log('Resp: ', resp);
};

export const getImageRes = async () => {
    const input = {
        image: await (
            await fetch(
                'https://drive.google.com/uc?id=1xnDte3ACls6kN43hyke4SN5VNWE84Frb',
            )).blob(),
    };
    const resp = await HfInference.request({
        model: 'microsoft/trocr-base-handwritten',
        accessToken: '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',
    }, input);

    console.log(resp);
};

getImageRes1();
