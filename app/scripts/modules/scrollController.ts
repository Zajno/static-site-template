import logger from 'app/logger';
import Component, { ComponentConfig } from 'app/core/component';

type ScrollDirection = 'down' | 'up';

export type ScrollControllerConfig = ComponentConfig & {
    callback: (direction: ScrollDirection) => void;
    wheelOffset: number;
    clearCounterDelay?: number;
};

export default class ScrollController extends Component<ScrollControllerConfig> {

    private _mouseCouterClearDelay: number;
    private _mouseCounter = 0;
    private _timer: NodeJS.Timeout;
    private _deltaY: number;
    private _wheelDirection: ScrollDirection;

    private get wheelOffset() { return this._config.wheelOffset; }
    private get eventCallback() { return this._config.callback; }

    doSetup() {
        this._mouseCouterClearDelay = this._config.clearCounterDelay || 100;
    }

    _setup() {
        this._addListener('wheel', (e) => {
            this._wheelHandler(e);
        });
    }

    _addListener(event, cb) {
        this.element.addEventListener(event, (e) => {
            cb(e);
        });
    }

    _removeListener(event, cb) {
        this.element.removeEventListener(event, (e) => {
            cb(e);
        });
    }

    _wheelHandler(e) {
        clearTimeout(this._timer);
        // this.time = performance.now();

        if (this._mouseCounter > this.wheelOffset) {
            return;
        }
        this._deltaY = e.deltaY ? e.deltaY : e.originalEvent && e.originalEvent.detail;

        this._wheelDirection = this._deltaY && this._deltaY > 0 ? 'down' : 'up';
        this._mouseCounter++;

        if (this._mouseCounter >= this.wheelOffset) {
            this.eventCallback(this._wheelDirection);
            this._mouseCounter = 0;
        } else {
            this._timer = setTimeout(() => {
                this._mouseCounter = 0;
            }, this._mouseCouterClearDelay);
        }
    }
}
