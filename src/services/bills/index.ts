import { TransCategory } from '../../utils/trans-category';

export function findClosestCategory(targetNumber: number): string | null {
    let closestCategory: string | null = null;
    let closestDifference = Infinity;

    Object.keys(billDimCatMap).forEach((category) => {
        const difference = Math.abs(targetNumber - billDimCatMap[category]);
        if (difference < closestDifference) {
            closestDifference = difference;
            closestCategory = category;
        }
    });

    return closestCategory;
}

export const billDimCatMap: { [category: string]: number } = {
    OTHERS: 0.68,
    DIESEL: 0.41,
    LONG: 0.28,
    VOUCHER: 1.5,
    A4: 0.75,
};

export const dimCategoryMap : { [category: string]: TransCategory[] } = {
    OTHERS: [
        TransCategory['Drinking Water for Employees'],
        TransCategory['HK items (bleaching powder,garbage bin etc)'],
        TransCategory['Apartment developments'],
        TransCategory['Borewell And Motor Maintenance'],
        TransCategory['CCTV / Intercomm'],
    ],
    DIESEL: [TransCategory.Diesel],
    LONG: [TransCategory.Bescom, TransCategory.BWSSB],
    VOUCHER: [
        TransCategory['House Keeping Salary'],
        TransCategory.Gardener,
        TransCategory['Audit Fees'],
        TransCategory['Garbage Collection Vendor (Hasirudala)/BBMP'],
        TransCategory['Apartment Work By Security and Others'],
        TransCategory['Electrical / Plumbing Repairs'],
        TransCategory['Septic Tank Repairs / Cleaning'],
        TransCategory['Water Tanks Cleaning'],
        TransCategory['Apartment Work By Security and Others'],
        TransCategory['Festival/Holiday Celebration'],
        TransCategory['Electrical / Plumbing Repairs'],
        TransCategory['Misc expenses'],
    ],
    A4: [
        TransCategory.Security,
        TransCategory['BAF Subscription Charges'],
        TransCategory['Apartment Painting'],
        TransCategory['Lift Maintenance (Johnson)'],
        TransCategory['HK items (bleaching powder,garbage bin etc)'],
        TransCategory['Health Club Maintenance'],
        TransCategory['Generator Maintenance and Repair'],
    ],
};
export default { findClosestCategory };
