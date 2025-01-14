import XLSX from 'xlsx';
import moment from 'moment';
import { Transaction } from '../service-types';

// eslint-disable-next-line no-shadow
export const XLS_TRANS_KEY_PREFIX = '__EMPTY_';
export const xLSTransKeys = {
    DATE_KEY: '2',
    DESC_KEY: '5',
    CHQ_NO_KEY: '9',
    WITHDRAWAL_KEY: '12',
    DEPOSIT_KEY: '17',
    BALANCE_KEY: ['21', '19', '20', '22'],
};

const CSV_START_STR = 'TRAN DATE,';
export const CsvTransKeys = {
    DATE_KEY: 'TRAN DATE',
    DESC_KEY: 'NARRATION',
    CHQ_NO_KEY: 'CHQ.NO.',
    WITHDRAWAL_KEY: 'WITHDRAWAL(DR)',
    DEPOSIT_KEY: 'DEPOSIT(CR)',
    BALANCE_KEY: 'BALANCE(INR)',
};
type CsvRecord = { [key: string]: string };

export const fileParserUtil = {

    parseCsvFile: (file: File) => {
        const output = new Promise<Transaction[]>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const fileContent = e.target.result;
                const lines = fileContent.split(/\r?\n/);

                // Find the header line starting with 'TRAN DATE,'
                const headerLineIndex = lines.findIndex((line: string) => line.startsWith(CSV_START_STR));
                if (headerLineIndex === -1) {
                    throw new Error(`Header line starting with '${CSV_START_STR}' not found.`);
                }

                // Parse the header line and extract the columns
                const headers = lines[headerLineIndex].split(',');

                // Parse the remaining lines into JSON objects
                const records: CsvRecord[] = [];
                for (let i = headerLineIndex + 1; i < lines.length; i += 1) {
                    const line = lines[i].trim();
                    if (line) {
                        const values = line.split(',');
                        const record: CsvRecord = {};
                        headers.forEach((header: string, index: number) => {
                            if (header) {
                                record[header] = values[index] || ''; // Handle missing values
                            }
                        });
                        records.push(record);
                    }
                }
                resolve(fileParserUtil.parseCsvTransactions(records));
            };
            reader.readAsBinaryString(file);
        });
        return output;
    },

    parseXLS: (file: File) => new Promise<Transaction[]>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const workBook = XLSX.read(e.target.result, {
                type: 'binary',
            });
            const worksheet = workBook.Sheets[workBook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(worksheet);
            const trans = fileParserUtil.parseTransactions(data as { [key: string]: string; }[]);
            resolve(trans);
        };
        reader.readAsBinaryString(file);
    }),

    parseAmount: (input: any) => {
        let out: any;
        if (typeof input === 'string') {
            out = parseFloat(input.replace('Cr', '').replaceAll(',', ''));
        } else {
            out = input;
        }
        return out;
    },

    getWorkingColumnKeyFromArray:
        (cols: string[], input: any) => cols.find((col) => !!input[`${XLS_TRANS_KEY_PREFIX}${col}`]),

    parseCsvTransactions: (input: { [key: string]: string; }[]) => {
        let trans: Transaction[] = [];
        if (input.length) {
            const dateKey = CsvTransKeys.DATE_KEY;
            const data = input.filter((row) =>
                row[dateKey] && row[dateKey].length === 10 && row[dateKey].includes('/') &&
                moment(row[dateKey], 'dd/MM/YYYY').toDate().toString() !== 'Invalid Date');
            const balanceKey = CsvTransKeys.BALANCE_KEY;
            const descKey = CsvTransKeys.DESC_KEY;
            const chqNoKey = CsvTransKeys.CHQ_NO_KEY;
            trans = data.map((row) => {
                const out: Transaction = {
                    Date: moment(row[dateKey], 'DD/MM/YYYY').toDate(),
                    Description: row[descKey],
                    'Cheque No': row[chqNoKey] || '',
                    Debit: 0,
                    Credit: 0,
                    Total: fileParserUtil.parseAmount(row[balanceKey]),
                    type: 'ONLINE',
                };
                if (row[CsvTransKeys.WITHDRAWAL_KEY]) {
                    out.Debit = fileParserUtil.parseAmount(row[CsvTransKeys.WITHDRAWAL_KEY]);
                }
                if (row[CsvTransKeys.DEPOSIT_KEY]) {
                    out.Credit = fileParserUtil.parseAmount(row[CsvTransKeys.DEPOSIT_KEY]);
                }
                return out;
            });
        }
        return trans;
    },

    parseTransactions: (input: { [key: string]: string; }[]) => {
        let trans: Transaction[] = [];
        if (input.length) {
            const dateKey = `${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DATE_KEY}`;
            const data = input.filter((row) =>
                row[dateKey] && row[dateKey].length === 10 && row[dateKey].includes('/') &&
                moment(row[dateKey], 'dd/MM/YYYY').toDate().toString() !== 'Invalid Date');
            let balanceKey = fileParserUtil.getWorkingColumnKeyFromArray(xLSTransKeys.BALANCE_KEY, data[0]) || '';
            const descKey = `${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DESC_KEY}`;
            const chqNoKey = `${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.CHQ_NO_KEY}`;
            balanceKey = `${XLS_TRANS_KEY_PREFIX}${balanceKey}`;
            trans = data.map((row) => {
                const out: Transaction = {
                    Date: moment(row[dateKey], 'DD/MM/YYYY').toDate(),
                    Description: row[descKey],
                    'Cheque No': row[chqNoKey] || '',
                    Debit: 0,
                    Credit: 0,
                    Total: fileParserUtil.parseAmount(row[balanceKey]),
                    type: 'ONLINE',
                };
                if (row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.WITHDRAWAL_KEY}`]) {
                    out.Debit = fileParserUtil.parseAmount(
                        row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.WITHDRAWAL_KEY}`]);
                }
                if (row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DEPOSIT_KEY}`]) {
                    out.Credit = fileParserUtil.parseAmount(
                        row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DEPOSIT_KEY}`]);
                }
                return out;
            });
        }
        return trans;
    },
};
export default fileParserUtil;
