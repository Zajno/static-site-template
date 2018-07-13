// core
import Component from 'core/component';
import logger from 'logger';

// libs
import $ from 'jquery';
import TweenLite from 'gsap';

/** @typedef {{show:number,hide:number}} ScrollCoeffs */

export default class Section extends Component {

    // SETUP -------------------------------------------------------------------

    _setup(config) {
        // DOM

        this._el = config.element;
        this._$el = $(this._el);

        this._y = 0.0;
        this._height = 0.0;

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

        this._setupSection(config);
        TweenLite.to(this._el, 1.15, { autoAlpha: 1.0, ease: 'Sine.easeInOut', delay: 0.54 });
    }

    /* abstract -- override in sub class to set up section */
    _setupSection(config) {}


    // WINDOW ------------------------------------------------------------------

    resize(width, height, yPos) {
        // console.log('Section.resize() height:', this._$el.outerHeight());

        this._y = yPos;
        this._height = this._$el.outerHeight(true);

        // logger.log('RESIZE: ', this._height, this);
    }


    // STATE -------------------------------------------------------------------

    /* abstract -- override in sub class to activate / deactivate section */
    _activate(delay, direction) {
        logger.log('_activate', this);
        // TweenLite.killTweensOf(this._el);
        // TweenLite.to(this._el, 0.82, { alpha: 1.0, y: 0, force3D: true, ease: 'Cubic.easeOut', delay: delay });
    }

    _deactivate(delay, direction) {
        logger.log('_deactivate', this);
        // TweenLite.killTweensOf(this._el);
        // TweenLite.to(this._el, 0.45, { alpha: 0.0, y: direction * 100.0, force3D: true, ease: 'Cubic.easeIn', delay: delay });
    }


    // ACCESSORS ---------------------------------------------------------------

    get y() {
        return this._$el.offset().top;
    }

    get height() {
        return this._$el.outerHeight(true);
        // return this._height;
    }
}
