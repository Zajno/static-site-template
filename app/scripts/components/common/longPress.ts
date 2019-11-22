import logger from 'app/logger';
import Component, { ComponentConfig } from 'app/core/component';

export type LongPressConfig = ComponentConfig & {
    longPressDuration: number;
    callback: (target: HTMLElement) => void;
    callBackAnimation: (target: HTMLElement, count: number) => void;
    callBackResetAnimation: (target: HTMLElement) => void;
};

export default class LongPress extends Component<LongPressConfig> {

    private _counter = 0;
    private _links: NodeListOf<HTMLElement>;
    private _longPressEvent = new CustomEvent('longpress');
    private _timerID: number;

    async doSetup() {
        this._links = this.element.querySelectorAll('.longPress-link');
    }

    _activate() {
        this._links.forEach((link) => {
            link.addEventListener('mousedown', this._pressingDown, false);
            link.addEventListener('touchstart', this._pressingDown, false);
            link.addEventListener('mouseup', this._notPressingDown, false);
            link.addEventListener('mouseleave', this._notPressingDown, false);
            link.addEventListener('touchend', this._notPressingDown, false);
            link.addEventListener('longpress', this._longPressHolder, false);
            link.addEventListener('click', (e) => e.preventDefault());
        });
    }

    _deactivate() {
        this._links.forEach((link) => {
            link.removeEventListener('mousedown', this._pressingDown);
            link.removeEventListener('touchstart', this._pressingDown);
            link.removeEventListener('mouseup', this._notPressingDown);
            link.removeEventListener('mouseleave', this._notPressingDown);
            link.removeEventListener('touchend', this._notPressingDown);
            link.removeEventListener('longpress', this._longPressHolder);
        });
    }

    _pressingDown = (e) => {
        // Start the timer
        // if ((e.which === 1 || e.type === 'touchstart') && e.target.classList.contains('js-active')) {
        if ((e.which === 1 || e.type === 'touchstart')) {
            requestAnimationFrame(() => { this._timer(e.target); });

            // logger.log('Pressing!', e);

            e.preventDefault();
        }
    }

    _notPressingDown = (e) => {
        // Stop the timer
        cancelAnimationFrame(this._timerID);

        this._counter = 0;
        this._config.callBackResetAnimation(e.target);
    }

    // Runs at 60fps when you are pressing down
    _timer = (target: HTMLElement) => {

        // logger.log('Timer tick!');

        if (this._counter < this._config.longPressDuration) {
            this._timerID = requestAnimationFrame(() => { this._timer(target); });
            this._counter += 1;

            this._config.callBackAnimation(target, this._counter);
        } else {
            logger.log('Press threshold reached! ');
            target.dispatchEvent(this._longPressEvent);
        }
    }

    _longPressHolder = (e) => {
        logger.log('longPress event fired!');
        this._config.callback(e.target);
    }
}
