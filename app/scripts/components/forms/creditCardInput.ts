import logger from 'app/logger';

import Component, { ComponentConfig } from 'app/core/component';
import creditCard from 'app/utils/creditCard';

function formatCCType(type) {
    return `fa-${type}`;
}

export type CreditCardInputConfig = ComponentConfig<HTMLInputElement>;

// add space after 4 digin on card number & change icon payment system
export default class CreditCardInput extends Component<CreditCardInputConfig> {

    private _icon: HTMLImageElement;
    private _iconClass: string;

    private get _input() { return this._config.el; }

    async doSetup() {

        this._input.onkeypress = this._onkeypress.bind(this);

        this._icon = this._input.parentElement.querySelector('.icon--card');
        this._iconClass = formatCCType(creditCard.DEFAULT);

        const _this = this;

        // backspace doesn't fire the keypress event
        this._input.onkeydown = e => {
            if (e.keyCode === 8 || e.keyCode === 46) // backspace or delete
            {
                e.preventDefault();

                this._formatAndPositionate(
                    '',
                    this._input.selectionStart === this._input.selectionEnd && (e.keyCode === 8 ? -1 : 1),
                );
            }
        };

        this._input.addEventListener('keyup', () => {
            let iconClass = creditCard.getType(this._input.value);
            iconClass = formatCCType(iconClass);
            // logger.log('CreditCardInput type =', iconClass);
            if (iconClass != this._iconClass) {
                this._icon.classList.remove(this._iconClass);
                this._iconClass = iconClass;
                this._icon.classList.add(this._iconClass);
            }
        });

        // A timeout is needed to get the new value pasted
        this._input.addEventListener('paste', () => setTimeout(() => { this._formatAndPositionate('', 0); }, 50));

       // reformat onblur just in case (optional)
        this._input.addEventListener('blur', () => { _this._formatAndPositionate(_this._input.value, 0, true); });
    }

    _onkeypress(e) {
        const code = e.charCode || e.keyCode || e.which;

        // Check for tab and arrow keys (needed in Firefox)
        if (code !== 9 && (code < 37 || code > 40) &&
            // and CTRL+C / CTRL+V
            !((e.code === 'KeyV' || e.ctrlKey) && (code === 99 || code === 118))) {

            e.preventDefault();

            const char = String.fromCharCode(code);

            // if the character is non-digit
            // OR
            // if the value already contains 15/16 digits and there is no selection
            // -> return false (the character is not inserted)

            const input = this._input;

            if (/\D/.test(char)
                || (input.selectionStart === input.selectionEnd
                    && input.value.replace(/\D/g, '').length >= creditCard.getDigitsCount(input.value)))
            {
                return false;
            }

            this._formatAndPositionate(char, 0);

            return undefined;
        }

        return undefined;
    }

    private _formatAndPositionate(char: string | false, removeDelta: number, blurring?: boolean) {
        let start = 0;
        let end = 0;
        let pos = 0;
        const separator = ' ';
        let { value } = this._input;

        if (char !== false) {
            start = this._input.selectionStart;
            end = this._input.selectionEnd;

            if (removeDelta < 0 && start > 0) { // handle backspace onkeydown
                start += removeDelta;

                if (value[start] === separator)
                    start += removeDelta;
            }

            if (removeDelta > 0) { // handle delete onkeydown
                if (value[end] === separator)
                    end += removeDelta;

                end += removeDelta;
            }

            // To be able to replace the selection if there is one
            value = value.substring(0, start) + char + value.substring(end);

            pos = start + char.length; // caret position
        }

        let d = 0; // digit count
        let gi = 0; // group index
        let newV = '';
        const groups = /^\D*3[47]/.test(value) // check for American Express
            ? [4, 6, 5]
            : [4, 4, 4, 4];

        for (let i = 0; i < value.length; i++) {
            if (/\D/.test(value[i])) {
                if (start > i) {
                    pos--;
                }
            } else {
                if (d === groups[gi]) {
                    newV += separator;
                    d = 0;
                    gi++;

                    if (start >= i) {
                        pos++;
                    }
                }
                newV += value[i];
                d++;
            }
            if (d === groups[gi] && groups.length === gi + 1) { // max length
                break;
            }
        }

        this._input.value = newV;

        if (char !== false && !blurring) {
            this._input.setSelectionRange(pos, pos);
        }
    }
}
