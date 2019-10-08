// core
import Component from 'core/component';

/** @typedef {{show:number,hide:number}} ScrollCoeffs */
/** @typedef {(import ("core/page").default)} Page */

export default class Section extends Component {

    // SETUP -------------------------------------------------------------------

    _setup(config) {
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

        if (this._el && this._el.style) {
            this._el.style.visibility = 'visible';
        }

        this._setupSection(config);
    }

    /* abstract -- override in sub class to set up section */
    _setupSection(config) {}

    // WINDOW ------------------------------------------------------------------

    resize(width, height) {
    }

    scroll(scrollPosition, scrollDirection) {
        const rect = this.rect;
        const totalHeight = this._page._height + rect.height;
        const yPos = totalHeight - rect.bottom;
        this.scrollCoef = yPos / totalHeight;
    }

    wheel(deltaY, wheelDirection) {
    }

    // ACCESSORS ---------------------------------------------------------------

    get animateOnSetup() { return true; }

    get logAnimation() { return true; }
}
