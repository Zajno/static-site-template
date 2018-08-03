
import subscribeAsync from 'api/subscribe';

import FormSection from 'sections/forms/formSection';

import setProperty from 'utils/setProperty';

export default class SusbcribeFormSection extends FormSection {

    _setupSection(config) {
        super._setupSection(config);

        /** @type {HTMLFormElement} */
        this._form = this._el.querySelector('form.sub-form');
        this._form.onsubmit = this._onSubmit.bind(this);

        this._description = this._el.querySelector('.subscription__container p.description');
    }

    _onSubmit(e) {
        e.preventDefault();

        if (this.validateInputs(true) > 0) {
            return;
        }

        this._doSubscribeAsync();
    }

    async _doSubscribeAsync() {

        try {
            const formData = {};
            this.inputs.forEach(inp => setProperty(formData, inp.name, inp.value));

            await subscribeAsync(formData);

            this._description.textContent = 'Thank you for subscribing to our Newsletter!';
        } catch (err) {

            this._description.textContent = 'Something went wrong, please try again.';
        }
    }
}
