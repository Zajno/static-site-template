import logger from 'logger';
import Component from 'core/component';
import { TweenMax } from 'gsap';

export default class LongPress extends Component {
    constructor(config) {
        super(config);

        this._counter = 0;

        this._pressingDown = this._pressingDown.bind(this);
        this._notPressingDown = this._notPressingDown.bind(this);
        this._longPressHolder = this._longPressHolder.bind(this);
        this._timer = this._timer.bind(this);
    }

    _setup(config) {

        this._longPressDuration = config.longPressDuration;
        this._longPressCallBack = config.callback;
        this._pressAnim = config.callBackAnimation;
        this._resetAnim = config.callBackResetAnimation;

        this._links = this._el.querySelectorAll('.longPress-link');

        this._longPressEvent = new CustomEvent('longpress');
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

    _pressingDown(e) {
        // Start the timer
        // if ((e.which === 1 || e.type === 'touchstart') && e.target.classList.contains('js-active')) {
        if ((e.which === 1 || e.type === 'touchstart')) {
            requestAnimationFrame(() => { this._timer(e.target); });

            // logger.log('Pressing!', e);

            e.preventDefault();
        }
    }

    _notPressingDown(e) {
        // Stop the timer
        cancelAnimationFrame(this._timerID);

        this._counter = 0;
        this._resetAnim(e.target);

        // logger.log('Not pressing!');
    }

    // Runs at 60fps when you are pressing down
    _timer(target) {

        // logger.log('Timer tick!');

        if (this._counter < this._longPressDuration) {
            this._timerID = requestAnimationFrame(() => { this._timer(target); });
            this._counter += 1;

            this._pressAnim(target, this._counter);
        } else {
            logger.log('Press threshold reached! ');
            target.dispatchEvent(this._longPressEvent);
        }
    }

    _longPressHolder(e) {
        logger.log('longPress event fired!');
        this._longPressCallBack(e.target);
    }
}
