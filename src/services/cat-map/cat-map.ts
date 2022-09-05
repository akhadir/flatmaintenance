export default {
    'Maintenance Collection': [{
        Credit: [{
            opr: 'in',
            value: [
                '2,600.00', '2600',
                '2,700.00', '2700',
                '2,800.00', '2800',
                '5,400.00', '5400',
                '5,500.00', '5500',
                '5,600.00', '5600',
                '8,100.00', '8100',
                '5,200.00', '5200',
                '10,800.00', '10800',
            ],
        }],
        Description: [{
            opr: 'having',
            value: ['maintenance', 'neft', 'upi', 'imps'],
        }],
    }],
    'Audit Fees': [{
        Description: [{
            opr: 'having',
            value: ['N YASWANTH', 'YASWANTH'],
        }],
    }],
    'Corpus Fund': [{
        Credit: [{
            opr: 'in',
            value: [
                '7500', '7,500.00',
                '15,000.00', '15000',
                '22,500.00', '22500',
                '30,000.00', '30000',
                '37,500.00', '37500',
                '45,000.00', '45000',
            ],
        }],
        Description: [{
            opr: 'having',
            value: ['corpus', 'neft', 'upi', 'imps'],
        }],
    }],
    Fine: [{
        Credit: [{
            opr: 'in',
            value: ['100', '200', '300'],
        }],
    }],
    Bescom: [{
        Description: [{
            opr: 'having',
            value: ['BESCOM', 'Electricity'],
        }],
    }],
    BWSSB: [{
        Description: [{
            opr: 'having',
            value: ['BANGALORE WATER SUPPLY', 'BWSSB', 'BANGALORE ONE'],
        }],
    }],
    'CCTV / Intercomm': [{
        Description: [{
            opr: 'having',
            value: ['SHANKAR TELECOM LINKS', 'Intercom'],
        }],
    }],
    Security: [{
        Debit: [{
            opr: 'in',
            value: ['35,000.00', '35000', '41000', '41,000.00'],
        }],
    }],
    'House Keeping Salary': [{
        Description: [{
            opr: 'regex',
            value: [
                'Housekeeping.+Salary',
                'House keeping.+Salary',
                'house-keeping.+salary',
                'housekeeping.+ladies',
                'hk.+salary',
            ],
        }],
    }],
    'Garden Maintenance': [{
        Description: [{
            opr: 'regex',
            value: ['garden', 'Gardner.+Salary', 'garden.+work', 'Manure'],
        }],
    }],
    'Garbage Collection Vendor (Hasirudala)/BBMP': [{
        Description: [{
            opr: 'having',
            value: ['SYED ALI BASHA'],
        }],
    }],
    'Borewell And Motor Maintenance': [{
        Description: [{
            opr: 'having',
            value: ['borewell', 'motor', 'coil', 'winding'],
        }],
    }],
    'Lift Maintenance (Johnson)': [{
        Description: [{
            opr: 'regex',
            value: ['JOHNSON.+LIFTS', 'Lift'],
        }],
    }],
    'HK items (bleaching powder,garbage bin etc)': [{
        Description: [{
            opr: 'regex',
            value: [
                'Housekeeping.+Items',
                'Housekeeping.+Material',
                'hk.+item',
                'HK.+Material',
                'bleaching',
                'garbage drum',
                'powder',
                'mop',
                'dust',
                'dustbin',
                'soap',
                'detergent',
                'broom',
                'switch',
                'tubelight',
                'switch',
                'light',
                'bulb',
                'Phenoyl',
                'powder',
                'phenoyl',
                'sanitizer',
                'cleaner',
                'dettol',
                'bottle',
                'neem oil',
                'tap',
                'kerosene',
            ],
        }],
    }],
    'Electrical / Plumbing Repairs': [{
        Description: [{
            opr: 'having',
            value: ['electric repair', 'electric work', 'electric', 'Chamundi', 'plumbing'],
        }],
    }],
    'Septic Tank Repairs / Cleaning': [{
        Description: [{
            opr: 'having',
            value: ['septik', 'septic', 'septic tank', 'sewage tank', 'sewage work', 'sewage pipe'],
        }],
    }],
    'Water Tanks Cleaning': [{
        Description: [{
            opr: 'regex',
            value: ['water.+tank'],
        }],
    }],
    'Generator Maintenance and Repair': [{
        Description: [{
            opr: 'regex',
            value: ['venus.+energy', 'kirloskar'],
        }],
    }],
    'SMS Charges/Cheque book (Vijaya Bank)': [{
        Description: [{
            opr: 'regex',
            value: ['SMS .+Alert', 'cheque.+book', 'charges', 'chq.+book'],
        }],
    }],
    'Health Club Maintenance': [{
        Description: [{
            opr: 'having',
            value: ['gym'],
        }],
    }],
    'Festival/Holiday Celebration': [{
        Description: [{
            opr: 'regex',
            value: ['diwali.+work', 'celebration', 'pooja', 'pongal', 'independence', 'republic', 'flag'],
        }],
    }],
    'Drinking Water for Employees': [{
        Description: [{
            opr: 'having',
            value: ['drinking', 'drinking water', 'mineral water', 'water purchase'],
        }],
    }],
    Diesel: [{
        Description: [{
            opr: 'regex',
            value: ['Diesel'],
        }],
    }],
    'BAF Subscription Charges': [{
        Description: [{
            opr: 'regex',
            value: ['BAF .+charges'],
        }],
    }],
    'Annual Bonus': [{
        Description: [{
            opr: 'regex',
            value: ['bonus'],
        }],
    }],
    'Interest on account': [{
        Description: [{
            opr: 'having',
            value: ['89630100005613'],
        }],
    }],
    'FD Deposit': [{
        Description: [{
            opr: 'having',
            value: ['TO TRANSFER', 'Repayment Credit'],
        }],
    }],
    'Tenant Deposit from the Owners': [{
        Credit: [{
            opr: 'in',
            value: ['10,000.00', '10000'],
        }],
    }],
    'Apartment Work By Security and Others': [{
        Description: [{
            opr: 'regex',
            value: [
                'Apartment.+Work',
                'Cleaning.+Rain Water',
            ],
        }],
    }],
    'Apartment Safety': [{
        Description: [{
            opr: 'having',
            value: [
                'sanitization',
                'sanitizing',
                'mask',
                'sheild',
                'shield',
                'spray',
                'cutting tree',
                'fire',
                'extinguisher',
                'rat poison',
            ],
        }],
    }],
    'Apartment developments': [{
        Description: [{
            opr: 'having',
            value: [
                'stationery',
                'pen',
                'paper',
                'folder',
                'files',
                'notebook',
                'note book',
                'note-book',
                'entry book',
                'reciept book',
                'bought',
                'purchased',
                'purchase of',
                'cash voucher',
            ],
        }],
    }],
    'Apartment repairs related': [{
        Description: [{
            opr: 'having',
            value: ['cement work', 'cement', 'service', 'repair', 'spanner', 'fixing', 'fixed'],
        }],
    }],
    'Misc expenses': [{
        Description: [{
            opr: 'having',
            value: ['tea', 'coffee'],
        }],
    }],
    'Extra Payment Received': [{
        Description: [{
            opr: 'having',
            value: ['maintenance', 'neft', 'upi', 'imps'],
        }],
        Credit: [{
            opr: 'regex',
            value: ['\\d'],
        }],
    }],
    'Other Income': [{
        Description: [{
            opr: 'having',
            value: ['income', 'other'],
        }],
        Credit: [{
            opr: '>',
            value: 0,
        }],
    }],
    'Cash Withdrawal / in hand': {
        or: [
            {
                Description: [{
                    opr: 'regex',
                    value: ['cash', 'withdrawal', 'bank', 'basavaraj', 'carry.+forwarded', 'self'],
                }],
            },
            {
                'Cheque No': [{
                    opr: 'regex',
                    value: ['\\d+'],
                }],
            },
        ],
    },
    'Deposit to RD account': [{
        Description: [{
            opr: 'having',
            value: ['3715125', 'SI:89630300010611'],
        }],
    }],
};
