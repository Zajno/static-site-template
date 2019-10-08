import logger from 'logger';
import Component from 'core/component';
import { TweenLite } from 'gsap';

export default class CustomScroll extends Component {
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);

        this._updateScroller = this._updateScroller.bind(this);
        this._scrollHandler = this._scrollHandler.bind(this);
    }

    _setup(config) {
        /** @type {HTMLElement} */
        this._el = config.el;
        /** @type {HTMLElement} */
        this._target = config.target;
        this._speed = config.speed || 0.01; // scroll speed

        this._resizeRequest = 1;
        this._endY = 0;
        this._y = 0;
        this._scrollRequest = 0;
        this._rafId = null;

        this._tickFunctions = [];


        TweenLite.set(this._target, {
            rotation: 0.01,
            force3D: true,
        });
    }

    registerTickFunction(func) {
        this._tickFunctions.push(func);
    }

    _activate() {
        this._updateScroller();

        this._el.addEventListener('scroll', this._scrollHandler);
    }

    _scrollHandler() {
        this._scrollRequest++;

        if (!this._rafId) {
            this._rafId = requestAnimationFrame(this._updateScroller);
        }
    }

    _updateScroller() {
        const resized = this._resizeRequest > 0;

        if (resized) {
            const height = this._target.clientHeight;
            this._el.body.style.height = height + 'px';
            this._resizeRequest = 0;
        }

        const scrollY = window.pageYOffset || document.documentElement.scrollTop || this._el.body.scrollTop || 0;

        this._endY = scrollY;
        this._y += (scrollY - this._y) * this._speed;

        if (Math.abs(scrollY - this._y) < 0.05 || resized) {
            this._y = scrollY;
            this._scrollRequest = 0;
        }

        TweenLite.set(this._target, {
            y: -this._y,
        });

        if (this._tickFunctions.length) {
            this._tickFunctions.forEach(func => func(this._y));
        }

        this._rafId = this._scrollRequest > 0 ? requestAnimationFrame(this._updateScroller) : null;
    }

    _deactivate() {
        this._el.removeEventListener('scroll', this._scrollHandler);
    }
}
