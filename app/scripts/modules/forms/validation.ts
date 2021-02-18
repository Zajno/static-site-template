import creditCard from '@zajno/common/lib/validation/creditCard';
import { ValidatorsRegExps as RE } from '@zajno/common/lib/validation/validators';

function getValueValidator(fieldName: string) {

    switch (fieldName) {
        case 'userInfo.fullName':
        case 'demo.fullName':
        case 'abuse.fullName': {
            // There is at least first and last name
            return val => RE.name.test(val.trim());
        }

        case 'accountSetup.accountAddress.city':
        case 'abuse.city':
        case 'abuse.reportedPerson': {
            //  only English letter
            return val => RE.englishLetters.test(val);
        }

        case 'sub.email':
        case 'userInfo.email':
        case 'forgot.email':
        case 'demo.email':
        case 'abuse.email': {
            return val => RE.email.test(val);
        }

        case 'userInfo.password':
        case 'pass-recov-success.password-new': {
        // At least one English letter, (?=.*?[a-zA-Z])
        // At least one digit, (?=.*?[0-9])
        // At least one special character, (?=.*?[#?!@$%^&*-])
        // Minimum eight in length .{8,} (with the anchors)
            return val => RE.password.test(val);
        }

        case 'userInfo.phoneNumber':
        case 'demo.phoneNumber':
        case 'abuse.phoneNumber':
        case 'abuse.reportedPhoneNumber': {
            // only digit & special character (+)
            return val => RE.phoneNumber.test(val);
        }

        case 'accountSetup.csv': {
        // only digit and 3 length
            return val => (RE.cvv.test(val) && val.length >= 3 && val.length <= 4);
        }

        case 'accountSetup.creditCardNumber': {
            return val => {
                const shortVal = val.replace(/ /gi, '');
                return RE.creditCardNumber.test(shortVal) && shortVal.length == creditCard.getDigitsCount(shortVal);
            };
        }

        case 'signup.agree': {
            return (val, /** @type {HTMLElement} el */el) => el.matches(':checked');
        }

        default: {
            break;
        }

    }

    return (() => true);
}

function getHandler(fieldName: string) {
    let re = null;

    switch (fieldName) {
        case 'accountSetup.csv':
        case 'abuse.contactCaptcha': {
            re = RE.creditCardNumber;
            break;
        }

        case 'userInfo.phoneNumber':
        case 'demo.phoneNumber':
        case 'abuse.phoneNumber':
        case 'abuse.reportedPhoneNumber': {
            re = RE.phoneNumber;
            break;
        }

        default: {
            break;
        }
    }

    if (re) {
        return e => {
            if (e.ctrlKey || e.altKey || e.metaKey)
                return;

            const chr = getChar(e);

            if (chr == null)
                return;

            if (!re.test(chr)) {
                return false;
            }
        };
    }

    return null;
}

/** @param {string} fieldName */
function getValidationFunction(fieldName) {
    const valueValidator = getValueValidator(fieldName);

    return (el, isRequired) => {
        const val = el.value;
        if (!val) {
            return !isRequired;
        }

        return !valueValidator || valueValidator(val, el);
    };
}

function getInputHandlerFunction(fieldName) {
    const handler = getHandler(fieldName);
    return handler;
}

function getChar(event: KeyboardEvent) {
    if (event.which == null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode); // IE
    }

    if (event.which != 0 && event.charCode != 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which);
    }

    return null;
}

export default {
    getValidationFunction,
    getInputHandlerFunction,
};
