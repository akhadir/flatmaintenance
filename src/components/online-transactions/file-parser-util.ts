import XLSX from 'xlsx';
import moment from 'moment';

// eslint-disable-next-line no-shadow
export enum XLSTransKeys {
    KEY_PREFIX = '__EMPTY_',
    DATE_KEY = '1',
    DESC_KEY = '3',
    CHQ_NO_KEY = '9',
    WITHDRAWAL_KEY = '11',
    DEPOSIT_KEY = '17',
    BALANCE_KEY = '22',
}
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
        const reader = new FileReader();
        reader.onload = (e: any) => {
            const workBook = XLSX.read(e.target.result, {
                type: 'binary',
            });
            // console.log(workBook.SheetNames);
            const worksheet = workBook.Sheets[workBook.SheetNames[0]];
            // const option = { header: 10 };
            const data = XLSX.utils.sheet_to_json(worksheet);
            fileParserUtil.parseTransactions(data as { [key: string]: string; }[]);
        };
        reader.readAsBinaryString(file);
    },

    parseDate: (input: string) => parseFloat(input.replace('Cr', '').replaceAll(',', '')),

    parseTransactions: (input: { [key: string]: string; }[]) => {
        console.log(input);
        const data = input.filter((row) => row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.BALANCE_KEY}`]);
        const trans: BankTransaction[] = data.map((row) => {
            const out: BankTransaction = {
                date: moment(row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.DATE_KEY}`], 'dd/MM/YYYY').toDate(),
                desc: row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.DESC_KEY}`],
                chqNo: row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.CHQ_NO_KEY}`] || '',
                withDrawal: 0,
                deposit: 0,
                balance: fileParserUtil.parseDate(
                    row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.BALANCE_KEY}`]),
            };
            if (row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.WITHDRAWAL_KEY}`]) {
                out.withDrawal = fileParserUtil.parseDate(
                    row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.WITHDRAWAL_KEY}`]);
            }
            if (row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.DEPOSIT_KEY}`]) {
                out.deposit = fileParserUtil.parseDate(
                    row[`${XLSTransKeys.KEY_PREFIX}${XLSTransKeys.DEPOSIT_KEY}`]);
            }
            return out;
        });
        console.log(trans);
    },
};
export default fileParserUtil;
