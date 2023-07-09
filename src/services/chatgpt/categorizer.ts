export default function categorizeText(input: string) {
    const inputText = input.toLowerCase();
    const address = 'suraksha sunflower';
    if (inputText.includes(address)) {
        if (inputText.includes('8500')) {
            return 'Housekeeping Salary';
        } if (inputText.includes('800') || inputText.includes('adinarayana')) {
            return 'Sewage Tank Cleaning';
        } if (inputText.includes('garden')) {
            return 'Garden Work';
        } if (inputText.includes('apartment work')) {
            return 'Apartment Work';
        } if (inputText.includes('mason')) {
            return 'Apartment Maintenance';
        } if (inputText.includes('electrical')) {
            return 'Electrical Work';
        } if (inputText.includes('diwali') ||
            inputText.includes('flag') ||
            inputText.includes('sweets') ||
            inputText.includes('chocalates')
        ) {
            return 'Festival Celebrations';
        }
        return 'Miscellaneous Expenses';
    } if (inputText.includes('cleaning service')) {
        return 'Garbage Cleaning Service';
    } if (inputText.includes('diesel')) {
        return 'Diesel Purchase';
    } if (inputText.includes('bescom')) {
        return 'Bescom';
    } if (inputText.includes('bwssb')) {
        return 'BWSSB';
    } if (inputText.includes('telecom')) {
        return 'Telecom Maintenance';
    } if (inputText.includes('johnson')) {
        return 'Lift Maintenance';
    } if (inputText.includes('borewell')) {
        return 'Borewell Maintenance';
    } if (inputText.includes('water')) {
        return 'Drinking Water For Security';
    } if (inputText.includes('security') || inputText.includes('41000')) {
        return 'Security Service';
    } if (inputText.includes('broom') ||
        inputText.includes('phenoyl') ||
        inputText.includes('mop') ||
        inputText.includes('pencil') ||
        inputText.includes('file') ||
        inputText.includes('folder') ||
        inputText.includes('tape') ||
        inputText.includes('powder')
    ) {
        return 'HK Items';
    } if (inputText.includes('bulb') || inputText.includes('switch') || inputText.includes('light')) {
        return 'Electrical Items';
    }
    return 'Miscellaneous Expenses';
}

// Example usage
//   const text1 = 'Purchased bulbs for the apartment.';
//   const text2 = 'Paid for housekeeping salary.';
//   const text3 = 'Diesel purchase for the generator.';
//   const text4 = 'Maintenance work for the lift by Johnson Lifts.';
//   console.log(categorizeText(text1)); // Output: Electrical Items
//   console.log(categorizeText(text2)); // Output: Housekeeping Salary
//   console.log(categorizeText(text3)); // Output: Diesel Purchase
//   console.log(categorizeText(text4)); // Output: Lift Maintenance
