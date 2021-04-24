import XLSX from 'xlsx';
import moment from 'moment';

// eslint-disable-next-line no-shadow
export const XLS_TRANS_KEY_PREFIX = '__EMPTY_';
export const xLSTransKeys = {
    DATE_KEY: '1',
    DESC_KEY: '3',
    CHQ_NO_KEY: '9',
    WITHDRAWAL_KEY: '11',
    DEPOSIT_KEY: '17',
    BALANCE_KEY: ['22', '20'],
};
export type BankTransaction = {
    date: Date;
    desc: string;
    chqNo: string;
    withDrawal: number;
    deposit: number;
    balance: number;
}
export const fileParserUtil = {
    parseXLS: (file: File) => {
        const prom = new Promise<BankTransaction[]>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const workBook = XLSX.read(e.target.result, {
                    type: 'binary',
                });
                console.log(workBook.SheetNames);
                const worksheet = workBook.Sheets[workBook.SheetNames[0]];
                console.log(worksheet);
                // const option = { header: 10 };
                const data = XLSX.utils.sheet_to_json(worksheet);
                const trans = fileParserUtil.parseTransactions(data as { [key: string]: string; }[]);
                resolve(trans);
            };
            reader.readAsBinaryString(file);
        });
        return prom;
    },

    parseAmount: (input: any) => {
        let out: any;
        if (typeof input === 'string') {
            out = parseFloat(input.replace('Cr', '').replaceAll(',', ''));
        } else {
            out = input;
        }
        return out;
    },

    parseTransactions: (input: { [key: string]: string; }[]) => {
        let trans: BankTransaction[] = [];
        if (input.length) {
            let balanceKey = xLSTransKeys.BALANCE_KEY[0];
            const balanceVal = input[0][`${XLS_TRANS_KEY_PREFIX}${balanceKey}`];
            if (!balanceVal) {
                [, balanceKey] = xLSTransKeys.BALANCE_KEY;
                // balanceVal = input[0][`${XLS_TRANS_KEY_PREFIX}${balanceKey}`];
            }
            const dateKey = `${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DATE_KEY}`;
            const data = input.filter((row) =>
                row[dateKey] && row[dateKey].length === 10 && row[dateKey].includes('/') &&
                moment(row[dateKey], 'dd/MM/YYYY').toDate().toString() !== 'Invalid Date');
            const descKey = `${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DESC_KEY}`;
            const chqNoKey = `${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.CHQ_NO_KEY}`;
            balanceKey = `${XLS_TRANS_KEY_PREFIX}${balanceKey}`;
            trans = data.map((row) => {
                const out: BankTransaction = {
                    date: moment(row[dateKey], 'DD/MM/YYYY').toDate(),
                    desc: row[descKey],
                    chqNo: row[chqNoKey] || '',
                    withDrawal: 0,
                    deposit: 0,
                    balance: fileParserUtil.parseAmount(row[balanceKey]),
                };
                if (row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.WITHDRAWAL_KEY}`]) {
                    out.withDrawal = fileParserUtil.parseAmount(
                        row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.WITHDRAWAL_KEY}`]);
                }
                if (row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DEPOSIT_KEY}`]) {
                    out.deposit = fileParserUtil.parseAmount(
                        row[`${XLS_TRANS_KEY_PREFIX}${xLSTransKeys.DEPOSIT_KEY}`]);
                }
                return out;
            });
        }
        return trans;
    },
};
export default fileParserUtil;
