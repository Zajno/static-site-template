import logger from 'logger';

export default class ScrollController {

    // SETUP -------------------------------------------------------------------

    constructor(config) {
        /** @type {HTMLElement} */
        this._el = config.el;

        /** @type {Function} */
        this._eventCallback = config.callback;

        /** @type {Number} */
        this._wheelOffset = config.wheelOffset;

        /** @type {Number} */
        this._mouseCouterClearDelay = config.clearCounterDelay || 100;

        this._mouseCounter = 0;
        this._setup();
    }

    _setup() {
        this._addListener('wheel', (e) => {
            this._wheelHandler(e);
        });
    }

    _addListener(event, cb) {
        this._el.addEventListener(event, (e) => {
            cb(e);
        });
    }

    _removeListener(event, cb) {
        this._el.removeEventListener(event, (e) => {
            cb(e);
        });
    }

    _wheelHandler(e) {
        clearTimeout(this._timer);
        this.time = performance.now();

        if (this._mouseCounter > this._wheelOffset) {
            return;
        }
        this._deltaY = e.deltaY ? e.deltaY : e.originalEvent && e.originalEvent.detail;

        this._wheelDirection = this._deltaY && this._deltaY > 0 ? 'down' : 'up';
        this._mouseCounter++;

        if (this._mouseCounter >= this._wheelOffset) {
            this._eventCallback(this._wheelDirection);
            this._mouseCounter = 0;
        } else {
            this._timer = setTimeout(() => {
                this._mouseCounter = 0;
            }, this._mouseCouterClearDelay);
        }
    }
}
