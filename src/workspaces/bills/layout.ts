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
                activeStep: 0,
            },
            children: [
                {
                    type: 'component',
                    compType: 'bill-config',
                    name: 'Bill Config',
                    id: 'bill-config',
                    children: [
                        {
                            type: 'field',
                            name: 'list-url',
                            id: 'field-1',
                            showAs: 'input',
                            config: {
                                name: 'listURL',
                                label: 'List URL',
                                mandatory: true,
                                value: '',
                                errors: [],
                            },
                        },
                        {
                            type: 'field',
                            name: 'fetch-url',
                            id: 'field-2',
                            showAs: 'input',
                            config: {
                                name: 'fetchURL',
                                label: 'Fetch URL',
                                mandatory: true,
                                value: '',
                                errors: [],
                            },
                        },
                        {
                            type: 'field',
                            name: 'download-url',
                            id: 'field-3',
                            showAs: 'input',
                            config: {
                                name: 'downloadURL',
                                label: 'Download URL',
                                mandatory: true,
                                value: '',
                                errors: [],
                            },
                        },
                        {
                            type: 'field',
                            name: 'update-url',
                            id: 'field-4',
                            showAs: 'input',
                            config: {
                                name: 'updateURL',
                                label: 'Update URL',
                                mandatory: true,
                                value: '',
                                errors: [],
                            },
                        },
                    ],
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
