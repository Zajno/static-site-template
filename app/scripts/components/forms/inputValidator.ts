import logger from 'app/logger';

import Component, { ComponentConfig } from 'app/core/component';
import { MOBILE_DEVICE_SCREEN_WIDTH } from 'app/utils/constants';

const classNames = {
    filled: 'filled',
    required: 'required',
    error: 'error',
    valid: 'valid',
    errorFocus: 'error-focus',
};

export type InputValidatorFunction = (i: HTMLInputElement, isRequired: boolean) => boolean;

export type InputValidatorConfoig = ComponentConfig<HTMLInputElement> & {
    validator: InputValidatorFunction;
    keyhandler: (e: KeyboardEvent) => void;
};

export default class InputValidator extends Component<InputValidatorConfoig> {

    private _name: string;
    private _errorElement: Element;
    private _originalError: string;
    private _wrapper: Element;
    private _isRequired: boolean;

    private _validator: InputValidatorFunction;
    private _validationResult?: boolean;

    private get input() { return this._config.el; }

    async doSetup() {

        if (!this.input) {
            throw new Error('Argument cannot be null: element');
        }

        window.appReady(this._checkAutoFill.bind(this));

        this._name = this.input.name;
        this._errorElement = this.element.querySelector('.error-tooltip__wrap p.description');
        this._originalError = this._errorElement && this._errorElement.textContent;
        this._wrapper = this.element.parentElement; // .input__wrap

        this.setValidator(this._config.validator);

        this._isRequired = this.element.classList.contains(classNames.required);

        if (this._config.keyhandler) {
            this.input.onkeypress = this._config.keyhandler;
        }

        this.input.addEventListener('blur', () => {
            this.doValidate(false);
            this._wrapper.classList.remove(classNames.errorFocus);
        });

        this.element.addEventListener('focus', () => {
            this._toggleClassErrorFocus();
        });

        this.element.addEventListener('keyup', () => {
            this.doValidate(false);
            this._toggleClassErrorFocus();
        });

    }

    setValidator(validator) {
        this._validator = validator;
        this._validationResult = null;
    }

    get name() { return this._name; }

    get value() { return this.input.value; }

    get validationResult() { return this._validationResult; }

    _checkAutoFill() {
        // logger.log(this._name, this.value || '<NO VALUE>', this.input.classList);
        // logger.log(window.getComputedStyle(this._el, ':-webkit-autofill'));
        if (this.value || this.input.classList.contains('-webkit-autofill')) {
            this._setFilled();
        }
    }

    _setFilled(filled = true) {
        this.input.classList.toggle(classNames.filled, filled);
    }

    doValidate(allowFocus) {
        this._validationResult = this._validator
            ? this._validator(this.input, this._isRequired)
            : true;

        this.makeElementValid(this._validationResult, allowFocus, this._originalError);
        return this._validationResult;
    }

    makeElementValid(isValid, isFocus, text) {
        this.input.classList.toggle(classNames.error, !isValid);
        this.input.classList.toggle(classNames.valid, isValid);

        if (!isValid) {
            if (text != null) {
                this._errorElement.textContent = text;
            }

            if (isFocus) {
                setTimeout(() => {
                    this.input.focus();
                }, 500);
            }
        }
    }

    _toggleClassErrorFocus() {
        if (window.innerWidth > MOBILE_DEVICE_SCREEN_WIDTH) {
            return;
        }

        if (this.input.classList.contains(classNames.error)) {
            this._wrapper.classList.add(classNames.errorFocus);
        } else {
            this._wrapper.classList.remove(classNames.errorFocus);
        }
    }
}
