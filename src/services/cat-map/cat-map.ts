export default {
    'Maintenance Collection': [{
        Credit: [{
            opr: 'in',
            value: [2600, 2700, 2800, 5400, 5600, 8100, 5200, 10800],
        }],
        Description: [{
            opr: 'having',
            value: ['maintenance'],
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
            value: [7500, 15000, 22500, 30000, 37500],
        }],
    }],
    Fine: [{
        Credit: [{
            opr: 'in',
            value: [100, 200, 300],
        }],
    }],
    Bescom: [{
        Description: [{
            opr: 'having',
            value: ['BESCOM', 'Electricity', 'BENGALORE ONE'],
        }],
    }],
    BWSSB: [{
        Description: [{
            opr: 'having',
            value: ['BANGALORE WATER SUPPLY', 'BWSSB'],
        }],
    }],
    Security: [{
        Description: [{
            opr: 'having',
            value: ['MUNIRAJU', 'MUNIRAJU K C'],
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
    Gardner: [{
        Description: [{
            opr: 'regex',
            value: ['Gardner.+Salary', 'garden.+work', 'Manure'],
        }],
    }],
    'Garbage Collection Vendor (Hasirudala)/BBMP': [{
        Description: [{
            opr: 'having',
            value: ['SYED ALI BASHA'],
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
    'CCTV / Intercomm': [{
        Description: [{
            opr: 'having',
            value: ['SHANKAR TELECOM LINKS', 'Intercom'],
        }],
    }],
    'Septic Tank Repairs / Cleaning': [{
        Description: [{
            opr: 'having',
            value: ['septik', 'septic', 'septic tank', 'sewage tank', 'sewage work'],
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
            value: ['venus.+energy'],
        }],
    }],
    'SMS Charges/Cheque book (Vijaya Bank)': [{
        Description: [{
            opr: 'regex',
            value: ['SMS .+Alert', 'cheque .+book', 'charges', 'chq .+book'],
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
    'Movement to/from FD/RD': [{
        Description: [{
            opr: 'having',
            value: ['TO TRANSFER', 'Repayment Credit'],
        }],
    }],
    'Tenant Credit from the Owners': [{
        Credit: [{
            opr: '==',
            value: 1000,
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
            ],
        }],
    }],
    'Apartment developments': [{
        Description: [{
            opr: 'having',
            value: [
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
            value: ['cement work', 'cement', 'service', 'repair', 'borewell', 'motor', 'spanner'],
        }],
    }],
    'Misc expenses': [{
        Description: [{
            opr: 'regex',
            value: ['apartment.+work', 'paid to raju', 'tea'],
        }],
    }],
};
