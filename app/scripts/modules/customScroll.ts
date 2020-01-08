import logger from 'app/logger';
import Component, { ComponentConfig } from 'app/core/component';
import gsap from 'gsap';

export type CustomScrollConfig = ComponentConfig & {
    el: HTMLDocument,
    target: HTMLElement,
    speed?: number,
};

export default class CustomScroll extends Component<CustomScrollConfig> {

    private _speed: number;
    private _resizeRequest: number;
    private _endY: number;
    private _y: number;
    private _scrollRequest: number;
    private _rafId: number;
    private _tickFunctions: ((y: number) => void)[];

    get doc() { return this._config.el; }

    doSetup() {
        this._speed = this._config.speed || 0.01; // scroll speed

        this._resizeRequest = 1;
        this._endY = 0;
        this._y = 0;
        this._scrollRequest = 0;
        this._rafId = null;

        this._tickFunctions = [];

        gsap.set(this._config.target, {
            rotation: 0.01,
            force3D: true,
        });
    }

    registerTickFunction(func) {
        this._tickFunctions.push(func);
    }

    _activate() {
        this._updateScroller();

        this.doc.addEventListener('scroll', this._scrollHandler);
    }

    _scrollHandler = () => {
        this._scrollRequest++;

        if (!this._rafId) {
            this._rafId = requestAnimationFrame(this._updateScroller);
        }
    }

    _updateScroller = () => {
        const resized = this._resizeRequest > 0;

        if (resized) {
            const height = this._config.target.clientHeight;
            this.doc.body.style.height = height + 'px';
            this._resizeRequest = 0;
        }

        const scrollY = window.pageYOffset || document.documentElement.scrollTop || this.doc.body.scrollTop || 0;

        this._endY = scrollY;
        this._y += (scrollY - this._y) * this._speed;

        if (Math.abs(scrollY - this._y) < 0.05 || resized) {
            this._y = scrollY;
            this._scrollRequest = 0;
        }

        gsap.set(this._config.target, {
            y: -this._y,
        });

        if (this._tickFunctions.length) {
            this._tickFunctions.forEach(func => func(this._y));
        }

        this._rafId = this._scrollRequest > 0 ? requestAnimationFrame(this._updateScroller) : null;
    }

    _deactivate() {
        this.doc.removeEventListener('scroll', this._scrollHandler);
    }
}
