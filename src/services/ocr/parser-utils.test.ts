import { parseExpenseInfo, findTopMatchingText } from './parser-utils'; // Update 'your-module' with the correct path to your module

describe('parseExpenseInfo', () => {
    it('should parse expense information correctly', () => {
        const text = `No.	BURAKSHAE CA SHEVOUCHER	
        OWNERS,	
        Site No -3764, Someshwara Temple Street	
        Date	31-19-2023 Biekahal, Oft Banner	
        in Fond	
        BANGALORE	
        8100-	
        Kia.	
        Pay to Ma	Mason tor Replacing	
        cunde	pai	ingthe maine de entrance	
        Re in words	Loilt drainage slabs, lement zLabou	
        Eight thousand one hundred	
        ment out y	
        Authorised by	
        cash	Drawn on Bank	Receiver's	
        Paid by	
        cheque	Signature	
        `;
        const expenseTypes = ['Food', 'Transport', 'Utilities'];

        const result = parseExpenseInfo(text, expenseTypes);

        expect(result.date).toEqual('31-19-2023');
        expect(result.amount).toEqual(8100);
        expect(result.description).toEqual('Expense Description');
    });

    it('should use default expense types if none provided', () => {
        const text = '15-05-2024 20.00 Expense_Description';

        const result = parseExpenseInfo(text);

        expect(result.date).toEqual('15-05-2024');
        expect(result.amount).toEqual(20.00);
        expect(result.description).toEqual('Expense Description');
    });
});

describe('findTopMatchingText', () => {
    it('should find top matching text', () => {
        const texts = ['Category 1', 'Category 2', 'Category 3'];
        const words = ['food'];

        const result = findTopMatchingText(texts, words);

        expect(result).toEqual('Category 1');
    });

    it('should return empty string if no matches found', () => {
        const texts = ['Category 1', 'Category 2', 'Category 3'];
        const words = ['unknown'];

        const result = findTopMatchingText(texts, words);

        expect(result).toEqual('');
    });
});
