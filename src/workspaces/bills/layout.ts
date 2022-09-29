export default {
    type: 'page',
    children: [
        {
            type: 'wizard',
            config: {
                steps: ['Uploaded Bills', 'Upload Bills', 'Process Bills', 'Save Bills'],
                optionalSteps: [0, 1],
            },
            children: [
                {
                    type: 'bill-config',
                    config: {
                        getURL: '',
                        updateURL: '',
                        auth: {
                            username: '',
                            password: '',
                        },
                    },
                },
                {
                    type: 'file-upload',
                    config: {
                        allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
                    },
                },
                {
                    type: 'process-bills',
                    config: {
                        unprocessedBills: [],
                        processedBills: [],
                    },
                },
                {
                    type: 'save-bills',
                    config: {
                        processedBills: [],
                    },
                },
            ],
        },
    ],
};
