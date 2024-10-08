import { TransCategory } from '../../utils/trans-category';

export function parseExpenseInfo(text: string, expenseTypes: string[] = []) {
    if (!expenseTypes || expenseTypes.length === 0) {
        expenseTypes = Object.values(TransCategory);
    }
    // Initialize the outputs
    let description = '';
    const dates: any[] = [];
    const amounts: any[] = [];
    // Split the text based on space, newline, or underscore delimiter
    const words = text.split(/[\s_]/m).filter((word) => word && word !== '/');

    // Iterate through the words to find the relevant information
    words.forEach((word) => {
        // Parse date
        if (/^\d{1,2}-\d{1,2}-\d{2,4}$/.test(word)) {
            dates.push(word);
        }
        // Parse amount
        if (/^\d+(\.\d{1,2})?-?$/.test(word)) {
            amounts.push(word);
        }
    });
    // Parse description
    if (!description) {
        description = text.replace(dates[0], '');
        description = description.replace(amounts[0], '').replace(/_/g, '');
        description = findTopMatchingText(expenseTypes, [description]) || description;
    }
    return {
        date: dates[0],
        amount: parseFloat(amounts[0]) || 0,
        description,
    };
}

export function findTopMatchingText(texts: string[], words: string[]) {
    const rankMap = new Map<string, number>();

    // Iterate through each text and count the number of word matches
    texts.forEach((text) => {
        let rank = 0;
        const key = text.toLowerCase();
        words.forEach((word) => {
            if (key.includes(word.toLowerCase())) {
                rank += 1;
            }
        });

        rankMap.set(text, rank);
    });

    const valueArray = Array.from(rankMap);
    // Sort the texts based on the rank in descending order
    const sortedTexts = [...valueArray].sort((a, b) => b[1] - a[1]);

    // Return the top matching text
    if (sortedTexts.length > 0 && sortedTexts[0][1] !== 0) {
        return sortedTexts[0][0];
    }

    return ''; // Return empty string if no matches are found
}
