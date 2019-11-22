import logger from 'app/logger';
import Component, { ComponentConfig } from 'app/core/component';
import { TweenLite } from 'gsap';

export type CursorConfig = ComponentConfig & {
    followDuration: number,
};

export default class Cursor extends Component<CursorConfig> {

    private _cursorOnLink: boolean;
    private _isLinkAlreadyActive: boolean;
    private _isCursorActive: boolean;
    private _cursorSmall: HTMLElement;
    private _cursorLarge: HTMLElement;
    private _cursorHold: HTMLElement;
    private _links: NodeListOf<HTMLElement>;
    private _holdLinks: NodeListOf<HTMLElement>;

    private _clientX: number;
    private _clientY: number;

    constructor(config) {
        super(config);

        this._mouseMoveHandler = this._mouseMoveHandler.bind(this);
        this._mouseDown = this._mouseDown.bind(this);
        this._mouseUp = this._mouseUp.bind(this);
        this._onLinkEnter = this._onLinkEnter.bind(this);
        this._onLinkLeave = this._onLinkLeave.bind(this);
        this._onHoldLinkEnter = this._onHoldLinkEnter.bind(this);
        this._onHoldLinkLeave = this._onHoldLinkLeave.bind(this);
        this._hideCursor = this._hideCursor.bind(this);
        this._showCursor = this._showCursor.bind(this);
    }

    async doSetup() {
        this._cursorOnLink = false;
        this._isLinkAlreadyActive = false;
        this._cursorSmall = this.element.querySelector('#cursor-inner');
        this._cursorLarge = this.element.querySelector('#cursor-outer');
        this._cursorHold = this.element.querySelector('.cursor-hold');

        this._links = this.element.querySelectorAll('.js-link');
        this._holdLinks = this.element.querySelectorAll('.js-link-hold');
    }

    _activate() {
        this.element.addEventListener('mousemove', this._mouseMoveHandler);
        this.element.addEventListener('mousedown', this._mouseDown);
        this.element.addEventListener('mouseup', this._mouseUp);

        this._links.forEach((link) => {
            link.addEventListener('mouseenter', this._onLinkEnter);
        });

        this._links.forEach((link) => {
            link.addEventListener('mouseleave', this._onLinkLeave);
        });

        this._holdLinks.forEach((holdLinks) => {
            holdLinks.addEventListener('mouseenter', this._onHoldLinkEnter);
        });

        this._holdLinks.forEach((holdLinks) => {
            holdLinks.addEventListener('mouseleave', this._onHoldLinkLeave);
        });
    }

    _deactivate() {

        this.element.removeEventListener('mousemove', this._mouseMoveHandler);
        this.element.removeEventListener('mousedown', this._mouseDown);
        this.element.removeEventListener('mouseup', this._mouseUp);

        this._links.forEach((link) => {
            link.removeEventListener('mouseenter', this._onLinkEnter);
        });

        this._links.forEach((link) => {
            link.removeEventListener('mouseleave', this._onLinkLeave);
        });

        this._holdLinks.forEach((holdLinks) => {
            holdLinks.removeEventListener('mouseenter', this._onHoldLinkEnter);
        });

        this._holdLinks.forEach((holdLinks) => {
            holdLinks.removeEventListener('mouseleave', this._onHoldLinkLeave);
        });
    }

    _mouseMoveHandler(e) {
        this._clientX = e.clientX;
        this._clientY = e.clientY;

        const cursorLargeWidth = this._cursorLarge.clientWidth;
        const cursorLargeHeight = this._cursorLarge.clientHeight;
        const borderWidth = 1;

        const cursorSmallWidth = this._cursorSmall.clientWidth;
        const cursorSmallHeight = this._cursorSmall.clientHeight;

        TweenLite.to(this._cursorSmall, 0.0, {
            x: this._clientX - cursorSmallWidth / 2 + borderWidth,
            y: this._clientY - cursorSmallHeight / 2 + borderWidth,
            rotation: 0.01,
        });
        TweenLite.to(this._cursorLarge, this._config.followDuration, {
            x: (this._clientX - cursorLargeWidth / 2),
            y: (this._clientY - cursorLargeHeight / 2),
            rotation: 0.01,
        });

        if (!this._isCursorActive) {
            this._showCursorFirstTime();
            this._isCursorActive = true;
        }
    }

    _mouseDown() {
        if (!this._cursorOnLink) {
            TweenLite.fromTo(this._cursorLarge, 0.25, { scale: 1 }, { scale: 0.8 });
        } else {
            TweenLite.fromTo(this._cursorLarge, 0.25, { scale: 1.5 }, { scale: 1 });
            TweenLite.fromTo(this._cursorSmall, 0.25, { scale: 1 }, { scale: 0.8 });
        }
    }

    _mouseUp() {
        if (!this._cursorOnLink) {
            TweenLite.fromTo(this._cursorLarge, 0.25, { scale: 0.8 }, { scale: 1 });
        } else {
            TweenLite.fromTo(this._cursorLarge, 0.25, { scale: 1 }, { scale: 1.5 });
            TweenLite.fromTo(this._cursorSmall, 0.25, { scale: 0.8 }, { scale: 1 });
        }
    }

    _onLinkEnter(e) {
        this._cursorOnLink = true;
        e.target.classList.add('active');

        if (e.target.dataset.enter === 'hide') {
            this._hideCursor();
        } else {
            this._scaleUp();
        }
    }

    _onLinkLeave(e) {
        this._cursorOnLink = false;

        if (e.target.dataset.enter === 'hide') {
            this._showCursor();
        } else {
            this._scaleDown();
        }

        e.target.classList.remove('active');
    }

    _onHoldLinkEnter(e) {
        this._cursorOnLink = true;
        e.target.classList.add('active');

        if (e.target.dataset.enter === 'hide') {
            this._hideCursor();
        } else {
            this._holdUp();
        }
    }

    _onHoldLinkLeave(e) {
        this._cursorOnLink = false;

        if (e.target.dataset.enter === 'hide') {
            this._showCursor();
        } else {
            this._holdDown();
        }

        e.target.classList.remove('active');
    }

    _showCursorFirstTime() {
        TweenLite.to(this._cursorSmall, 0.7, { opacity: 1, scale: 1 });
        TweenLite.to(this._cursorLarge, 0.7, { opacity: 1, scale: 1 });
    }

    _scaleUp() {
        TweenLite.to(this._cursorSmall, 0.2, { scale: 0 });
        TweenLite.to(this._cursorLarge, 0.4, { scale: 1.5 });
    }

    _holdUp() {
        TweenLite.to(this._cursorSmall.style, 0.2, { background: 'transparent' });
        TweenLite.to(this._cursorLarge, 0.4, { scale: 1.5 });
        TweenLite.to(this._cursorHold, 0.3, { scale: 1 });
    }

    _holdDown() {
        TweenLite.to(this._cursorSmall.style, 0.2, { background: '#FF9A90' });
        TweenLite.to(this._cursorLarge, 0.4, { scale: 1 });
        TweenLite.to(this._cursorHold, 0.1333, { scale: 0 });
    }

    _scaleDown() {
        TweenLite.to(this._cursorSmall, 0.2, { scale: 1 });
        TweenLite.to(this._cursorLarge, 0.4, { scale: 1 });
    }

    _showCursor() {
        TweenLite.to(this._cursorSmall, 0.2, { opacity: 1, scale: 1 });
        TweenLite.to(this._cursorLarge, 0.2, { opacity: 1, scale: 1 });
        TweenLite.to(this._cursorHold, 0.2, { opacity: 1 });
    }

    _hideCursor() {
        TweenLite.to(this._cursorSmall, 0.2, { opacity: 0, scale: 1 });
        TweenLite.to(this._cursorLarge, 0.2, { opacity: 0, scale: 1 });
        TweenLite.to(this._cursorHold, 0.2, { opacity: 0 });
    }
}
