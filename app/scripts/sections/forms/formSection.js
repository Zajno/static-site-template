import logger from 'logger';

import Section from 'core/section';
import InputValidator from 'components/forms/inputValidator';

import validation from 'modules/forms/validation';

/** @typedef {(import "pages/commonPage").default} CommonPage */

const classNames = {
    active: 'active',
};

export class FormModule {

    constructor({ id, element }) {

        /** @type {InputValidator[]} */
        this._inputs = [];
        /** @type {Object.<string,Input>} */
        this._inputsMap = {};

        this._id = id;
        /** @type {HTMLElement} */
        this._el = element;

        // collect
        this._el.querySelectorAll('.custom-form input, select, textarea').forEach(inp => {
            const { name } = inp;
            if (this._inputsMap[name]) {
                logger.error(`[${this.id}]: Duplicated input keyname: ${name}. Item will be skipeed:`, inp);
                return;
            }

            const inpObj = new InputValidator({
                element: inp,
                validator: validation.getValidationFunction(name),
                keyhandler: validation.getInputHandlerFunction(name),
            });

            this._inputsMap[inpObj.name] = inpObj;
            this._inputs.push(inpObj);
        });

        // enable password icon
        this._el.querySelectorAll('.password-has-icon').forEach(/** @param {HTMLInputElement} inputWithIcon */ inputWithIcon => {

            const icon = inputWithIcon.parentElement.querySelector('.icon--password');

            icon.addEventListener('mouseenter', function () {
                inputWithIcon.type = 'text';
            });

            icon.addEventListener('mouseleave', function () {
                inputWithIcon.type = 'password';
            });
        });

        // logger.log('FormSection inputs:', this._inputsMap);
    }

    get id() { return this._id; }

    get inputs() { return this._inputs; }

    /** @param {InputValidator} input */
    addInput(input) {
        if (this._inputsMap[input.name]) {
            const index = this._inputs.findIndex(i => i.name === input.name);
            this._inputs.splice(index, 1);
        }

        this._inputsMap[input.name] = input;
        this._inputs.push(input);
    }

    /**
     * @param {string} name
     * @returns {InputValidator}
     */
    getInput(name) {
        return this._inputsMap[name];
    }

    validateInputs(allowFocus) {
        let count = 0;

        // reverse iteration
        for (let i = this._inputs.length - 1; i >= 0; --i) {
            const inp = this._inputs[i];
            const res = inp.doValidate(allowFocus);
            if (!res) {
                ++count;
            }
        }

        logger.log(`[${this.id}] validateInputs: found error =`, count);

        return count;
    }

    activate() {
        this._el.classList.add(classNames.active);
    }

    deactivate() {
        this._el.classList.remove(classNames.active);
    }
}

export default class FormSection extends Section {
    _setupSection(config) {
        /** @type {CommonPage} */
        this._page;

        super._setupSection(config);

        this._theForm = new FormModule({ element: this._el });

    }

    get id() { return this._theForm.id; }

    get inputs() { return this._theForm.inputs; }

    /** @param {InputValidator} input */
    addInput(input) {
        this._theForm.addInput(input);
    }

    getInput(name) {
        return this._theForm.getInput(name);
    }

    _activate() {
        this._theForm.activate();
    }

    deactivate() {
        this._theForm.deactivate();
    }

    validateInputs(allowFocus) {
        return this._theForm.validateInputs(allowFocus);
    }
}
