import logger from '@zajno/common/lib/logger';

import Section from 'app/core/section';
import InputValidator from 'app/components/forms/inputValidator';

import validation from 'app/modules/forms/validation';

const classNames = {
    active: 'active',
};

export class FormModule {

    private _inputs: InputValidator[] = [];
    private _inputsMap: { [key: string]: InputValidator } = {};

    private readonly _id: string;
    private readonly _el: HTMLElement;

    constructor({ id, element }: { id: string, element: HTMLElement }) {

        this._id = id;
        this._el = element;

        // collect
        this._el.querySelectorAll('.custom-form input, select, textarea').forEach((inp: HTMLInputElement) => {
            const { name } = inp;
            if (this._inputsMap[name]) {
                logger.error(`[${this.id}]: Duplicated input keyname: ${name}. Item will be skipeed:`, inp);
                return;
            }

            const inpObj = new InputValidator({
                el: inp,
                validator: validation.getValidationFunction(name),
                keyhandler: validation.getInputHandlerFunction(name),
            });

            this._inputsMap[inpObj.name] = inpObj;
            this._inputs.push(inpObj);
        });

        // enable password icon
        this._el.querySelectorAll('.password-has-icon').forEach((inputWithIcon: HTMLInputElement) => {

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

    addInput(input: InputValidator) {
        if (this._inputsMap[input.name]) {
            const index = this._inputs.findIndex(i => i.name === input.name);
            this._inputs.splice(index, 1);
        }

        this._inputsMap[input.name] = input;
        this._inputs.push(input);
    }

    getInput(name: string): InputValidator {
        return this._inputsMap[name];
    }

    validateInputs(allowFocus: boolean) {
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

    private _theForm: FormModule;

    protected async doSetup() {
        await super.doSetup();

        this._theForm = new FormModule({ id: '?', element: this.element });
    }

    get id() { return this._theForm.id; }

    get inputs() { return this._theForm.inputs; }

    addInput(input: InputValidator) {
        this._theForm.addInput(input);
    }

    getInput(name: string) {
        return this._theForm.getInput(name);
    }

    _activate() {
        this._theForm.activate();
    }

    deactivate() {
        this._theForm.deactivate();
    }

    validateInputs(allowFocus: boolean) {
        return this._theForm.validateInputs(allowFocus);
    }
}
