export default class Component {

    // SETUP -------------------------------------------------------------------

    constructor(config) {
        // state
        this._active  = false;

        // setup
        this._setup(config);
    }

    /* abstract -- override in sub class to set up component */
    _setup(config) {}


    // STATE -------------------------------------------------------------------

    activate(delay = 0.0, direction = 1.0) {
        if (this._active)
            return;

        this._active = true;
        this._activate(delay, direction);
    }

    deactivate(delay = 0.0, direction = 1.0) {
        if (!this._active)
            return;

        this._active = false;
        this._deactivate(delay, direction);
    }

    /* abstract -- override in sub class to activate / deactivate component */
    _activate(delay, direction) {}
    
    _deactivate(delay, direction) {}
}
