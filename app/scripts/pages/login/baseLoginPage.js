import logger from 'logger';

import CommonPage from 'pages/commonPage';
import FormSection from 'sections/forms/formSection';

import setProperty from 'utils/setProperty';

/** @typedef {(import "components/forms/inputValidator").default} InputValidator */

class LoginFormSectionBase extends FormSection {
    constructor(config) {
        super(config);

        this.onsubmit = null;
        this.validateHook = null;
    }

    _setupSection(config) {
        super._setupSection(config);

        /** @type {HTMLFormElement} */
        this._form = this._el.querySelector(`form#${this.formId}`);
        this._form.onsubmit = this._onSubmit.bind(this);
    }

    get formId() { throw new Error('abstract'); }

    _onSubmit(e) {
        e.preventDefault();

        if (!this._doValidation()) {
            return;
        }

        if (this.validateHook && !this.validateHook(this)) {
            return;
        }

        if (this.onsubmit) {
            this.onsubmit(this.inputs);
        }
    }

    _doValidation() {
        return this.validateInputs(true) === 0;
    }
}

function createLoginFormSection({ formId }) {
    return class Form extends LoginFormSectionBase {
        get formId() { return formId; }
    };
}


export default class BaseLoginPage extends CommonPage {
    _setup() {
        this._sectionTypes = [
            this._createSectionType(),
        ];

        super._setup();

        /** @type {LoginFormSectionBase} */
        this._theForm = this._sections[0];
        this._theForm.onsubmit = () => {
            const formData = {};
            this.inputs.forEach(inp => setProperty(formData, inp.name, inp.value));

            this.doSumbit(formData);
        };

        this._theForm.validateHook = this.validate.bind(this);
    }

    _createSectionType() {
        return createLoginFormSection({
            formId: this.formId,
        });
    }

    get sectionTypes() { return this._sectionTypes; }

    get inputs() { return this._theForm.inputs; }

    get section() { return this._theForm._el; }

    get form() { return this._theForm._form; }

    get formId() { throw new Error('abstract'); }

    /** @param {LoginFormSectionBase} form */
    validate(form) {
        return true;
    }

    doSumbit(formData) {
        throw new Error('abstract');
    }

    get enabledVideosReplace() { return false; }

    get enableHeader() { return false; }

    get enabledImagesLazyLoad() { return false; }

    get enableVideoModals() { return false; }
}
