import logger from 'logger';

import Component from 'core/component';
import { MOBILE_DEVICE_SCREEN_WIDTH } from 'utils/constants';

const classNames = {
    filled: 'filled',
    required: 'required',
    error: 'error',
    valid: 'valid',
    errorFocus: 'error-focus',
};

export default class InputValidator extends Component {
    _setup({ element, validator, keyhandler }) {

        if (!element) {
            throw new Error('Argument cannot be null: element');
        }

        /** @type {HTMLElement} */
        this._el = element;

        window.appReady(this._checkAutoFill.bind(this));

        this._name = this._el.name;
        this._errorElement = this._el.parentElement.querySelector('.error-tooltip__wrap p.description');
        this._originalError = this._errorElement && this._errorElement.textContent;
        this._wrapper = this._el.parentElement; // .input__wrap

        this.setValidator(validator);

        this._isRequired = this._el.classList.contains(classNames.required);

        if (keyhandler) {
            this._el.onkeypress = keyhandler;
        }

        this._el.addEventListener('blur', () => {
            this.doValidate(false);
            this._wrapper.classList.remove(classNames.errorFocus);
        });

        this._el.addEventListener('focus', () => {
            this._toggleClassErrorFocus();
        });

        this._el.addEventListener('keyup', () => {
            this.doValidate(false);
            this._toggleClassErrorFocus();
        });

    }

    setValidator(validator) {
        this._validator = validator;
        this._validationResult = null;
    }

    get name() { return this._name; }

    get value() { return this._el.value; }

    get validationResult() { return this._validationResult; }

    _checkAutoFill() {
        logger.log(this._name, this.value || '<NO VALUE>', this._el.classList);
        // logger.log(window.getComputedStyle(this._el, ':-webkit-autofill'));
        if (this.value || this._el.classList.contains('-webkit-autofill')) {
            this._setFilled();
        }
    }

    _setFilled(filled = true) {
        if (filled) {
            this._el.classList.add(classNames.filled);
        } else {
            this._el.classList.remove(classNames.filled);
        }
    }

    doValidate(allowFocus) {
        this._validationResult = this._validator
            ? this._validator(this._el, this._isRequired)
            : true;

        this.makeElementValid(this._validationResult, allowFocus, this._originalError);
        return this._validationResult;
    }

    makeElementValid(isValid, isFocus, text) {
        if (isValid) {
            this._el.classList.remove(classNames.error);
            this._el.classList.add(classNames.valid);
        } else {
            this._el.classList.remove(classNames.valid);
            this._el.classList.add(classNames.error);

            if (text != null) {
                this._errorElement.textContent = text;
            }

            if (isFocus) {
                setTimeout(() => {
                    this._el.focus();
                }, 500);
            }
        }
    }

    _toggleClassErrorFocus() {
        if (window.innerWidth > MOBILE_DEVICE_SCREEN_WIDTH) {
            return;
        }

        if (this._el.classList.contains(classNames.error)) {
            this._wrapper.classList.add(classNames.errorFocus);
        } else {
            this._wrapper.classList.remove(classNames.errorFocus);
        }
    }
}
