import FormSection from 'app/sections/forms/formSection';
import setProperty from 'app/utils/setProperty';

export default class SusbcribeFormSection extends FormSection {

    private _form: HTMLFormElement;
    private _description: HTMLParagraphElement;

    protected async doSetup() {
        await super.doSetup();

        this._form = this.element.querySelector('form.sub-form');
        this._form.onsubmit = this._onSubmit.bind(this);

        this._description = this.element.querySelector('.subscription__container p.description');
    }

    private _onSubmit(e: Event) {
        e.preventDefault();

        if (this.validateInputs(true) > 0) {
            return;
        }

        this._doSubscribeAsync();
    }

    private async _doSubscribeAsync() {

        try {
            const formData = {};
            this.inputs.forEach(inp => setProperty(formData, inp.name, inp.value));

            // await subscribeAsync(formData);

            this._description.textContent = 'Thank you for subscribing to our Newsletter!';
        } catch (err) {

            this._description.textContent = 'Something went wrong, please try again.';
        }
    }
}
