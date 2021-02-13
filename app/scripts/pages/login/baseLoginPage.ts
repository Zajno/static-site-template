import CommonPage from 'app/pages/commonPage';
import FormSection from 'app/sections/forms/formSection';

import setProperty from 'app/utils/setProperty';
import { SectionCtor } from 'app/core/section';
import InputValidator from 'app/components/forms/inputValidator';

class LoginFormSectionBase extends FormSection {

    private _form: HTMLFormElement;
    public onsubmit: (inputs: InputValidator[]) => void;
    public validateHook: (loginSection: LoginFormSectionBase) => boolean;

    constructor(config) {
        super(config);

        this.onsubmit = null;
        this.validateHook = null;
    }

    protected async doSetup() {
        await super.doSetup();

        this._form = this.element.querySelector(`form#${this.formId}`);
        this._form.onsubmit = this._onSubmit.bind(this);
    }

    get formId() { throw new Error('abstract'); }
    get form() { return this._form; }

    private _onSubmit(e: Event) {
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

    private _sectionTypes: SectionCtor[];
    private _theForm: LoginFormSectionBase;

    protected async setupPageAsync() {
        this._sectionTypes = [
            this._createSectionType(),
        ];
    }

    protected async afterSetup() {
        this._theForm = this.getSection(0);

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

    get section() { return this._theForm.element; }

    get form() { return this._theForm.form; }

    get formId() { throw new Error('abstract'); }

    /** @param {LoginFormSectionBase} form */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    validate(form) {
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    doSumbit(formData) {
        throw new Error('abstract');
    }

    get enabledVideosReplace() { return false; }

    get enableHeader() { return false; }

    get enabledImagesLazyLoad() { return false; }

    get enableVideoModals() { return false; }
}
