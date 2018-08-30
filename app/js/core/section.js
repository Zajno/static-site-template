// core
import Component from 'core/component';

/** @typedef {{show:number,hide:number}} ScrollCoeffs */
/** @typedef {(import "core/page").default} Page */

export default class Section extends Component {

    // SETUP -------------------------------------------------------------------

    _setup(config) {
        // DOM

        /** @type {HTMLElement} */
        this._el = config.element;
        /** @type {Page} */
        this._page = config.page;

        /** @type {Object.<string, ScrollCoeffs>} */
        this.scrollCoeffs = {
            down: {
                show: 0.3,
                hide: 0.5,
            },
            up: {
                show: 0.3,
                hide: 0.3,
            },
        };

        // setup

        this._el.style.visibility = 'visible';
        this._setupSection(config);
    }

    /* abstract -- override in sub class to set up section */
    _setupSection(config) {}

    // WINDOW ------------------------------------------------------------------

    resize(width, height) {
    }

    scroll(scrollPosition, scrollDirection) {
    }

    // ACCESSORS ---------------------------------------------------------------

    get animateOnSetup() { return true; }

    get logAnimation() { return true; }
}
