import { checkDigitOnly, checkSpecialChar } from '../lib/utils/helper';
const digit = '1000';
const nonDigit = '1000XYZ';
const withSpecChar = '#^^%*()*776hrr';
const withoutSpecChar = '1123KiO';

describe('Check Digit Only function', () => {
    test('Returns boolean true for correct input', () => {
        expect(checkDigitOnly(digit)).toEqual(true);
    });
    test('Returns boolean false for incorrect input', () => {
        expect(checkDigitOnly(nonDigit)).toEqual(false);
    });
});

describe('Check special character function', () => {
    test('Returns boolean true for correct input', () => {
        expect(checkSpecialChar(withSpecChar)).toEqual(true);
    });
    test('Returns boolean false for incorrect input', () => {
        expect(checkSpecialChar(withoutSpecChar)).toEqual(false);
    });
});
