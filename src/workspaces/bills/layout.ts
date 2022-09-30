export default {
    id: 'page',
    name: 'Bills Page',
    type: 'page',
    children: [
        {
            type: 'wizard',
            name: 'Wizard',
            id: 'wizard',
            config: {
                steps: ['Uploaded Bills', 'Upload Bills', 'Process Bills', 'Save Bills'],
                optionalSteps: [0, 1],
            },
            children: [
                {
                    type: 'bill-config',
                    name: 'Bill Config',
                    id: 'bill-config',
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
                    name: 'Upload Bills',
                    id: 'file-upload-1',
                    config: {
                        allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf'],
                    },
                },
                {
                    type: 'process-bills',
                    name: 'Process Bills',
                    id: 'process-bill',
                    config: {
                        unprocessedBills: [],
                        processedBills: [],
                    },
                },
                {
                    type: 'save-bills',
                    name: 'Save Parsed Bills',
                    id: 'save-bills',
                    config: {
                        processedBills: [],
                    },
                },
            ],
        },
    ],
};
