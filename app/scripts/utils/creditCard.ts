const regexp = /^\D*3[47]/;

const types = {
    null: 'credit-card-alt',
    3: 'cc-amex',
    4: 'cc-visa',
    5: 'cc-mastercard',
    6: 'cc-discover',
};

function getDigitsCount(val: string) {
    return regexp.test(val) ? 15 : 16; // 15 digits if Amex
}

function getType(cardNumber: string | number) {
    const val = cardNumber + '';
    const firstDigit = val && val[0];
    return types[firstDigit] || types.null;
}

export default {
    DEFAULT: types.null,
    getDigitsCount,
    getType,
};
