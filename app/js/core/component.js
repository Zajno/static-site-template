import logger from 'logger';

export default class Component {

    // SETUP -------------------------------------------------------------------
    /** @param {{el:HTMLElement}} config */
    constructor(config) {
        // state
        this._active = false;
        /** @type {HTMLElement} */
        this._el = config.el;

        // setup
        this._setup(config);
    }

    get element() { return this._el; }

    get isActive() { return this._active; }

    /* abstract -- override in sub class to set up component */
    /** @param {{el:HTMLElement}} config */
    _setup(config) {}

    // STATE -------------------------------------------------------------------

    activate(delay = 0.0, direction = 1.0) {
        if (this._active) {
            return true;
        }

        this._active = true;
        if (this.logActivation) {
            logger.log('Activating:', this);
        }

        return this._activate(delay, direction);
    }

    deactivate(delay = 0.0, direction = 1.0) {
        if (!this._active)
            return true;

        this._active = false;
        if (this.logActivation) {
            logger.log('Deactivating:', this);
        }

        return this._deactivate(delay, direction);
    }

    /* abstract -- override in sub class to activate / deactivate component */
    _activate(delay, direction) {}

    _deactivate(delay, direction) {}

    get rect() { return this._el ? this._el.getBoundingClientRect() : {}; }

    get isOnScreen() {
        const r = this.rect;
        if (r.bottom < 0) {
            return false;
        }

        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return r.top - viewHeight < 0;
    }

    get logActivation() { return false; }
}
