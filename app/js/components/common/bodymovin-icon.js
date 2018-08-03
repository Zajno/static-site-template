// import logger from 'logger';

// core
import Component from 'core/component';

// libs
import bodymovin from 'bodymovin';
import TweenLite from 'gsap/TweenLite';


export default class BodymovinIcon extends Component {

    // SETUP -------------------------------------------------------------------

    _setup(config) {
        this._el = config.el;

        this._bodymovinParams = {
            container: this._el,
            renderer: 'svg',
            loop: false,
            autoplay: false,
            path: this._el.dataset.bodymovinPath,
        };

        this._isComplete = true;
        this._isLoaded = false;
        this._playPending = false;

        // this._playBodymovin(false);
        this._playBodymovin = this._playBodymovin.bind(this);

        // this._checkAnimationLoaded();
        TweenLite.set(this._el, { alpha: 0.0, force3D: true });
    }

    _checkAnimationLoaded() {
        if (this._animBodymovin) {
            return;
        }

        this._animBodymovin = bodymovin.loadAnimation(this._bodymovinParams);

        this._animBodymovin.addEventListener('complete', () => {
            // this._animBodymovin.goToAndStop(0);
            this._isComplete = true;
        });

        if (!this._animBodymovin.isLoaded) {
            this._animBodymovin.addEventListener('DOMLoaded', () => {
                // logger.log('[BodymovinIcon] DOMLoaded', this);

                this._isLoaded = true;
                if (this._playPending) {

                    this._playPending = false;
                    setTimeout(() => {
                        // logger.log('[BodymovinIcon] Play Pending', this);
                        this._animBodymovin.play();
                    }, 500);
                }
            });
        } else {
            this._isLoaded = true;
        }
    }

    _playBodymovin() {
        if (this._isLoaded) {
            if (this._isComplete) {
                this._animBodymovin.goToAndStop(0);
                this._isComplete = false;
            }

            this._animBodymovin.play();
        } else {
            this._playPending = true;
        }
    }

    // STATE -------------------------------------------------------------------

    _activate(delay, direction) {
        this._checkAnimationLoaded();

        TweenLite.killTweensOf(this._el);

        TweenLite.fromTo(this._el, 0.75, { alpha: 0.0 }, { alpha: 1.0, ease: 'Sine.easeInOut', delay: delay });
        TweenLite.fromTo(this._el, 2.56, { scale: 0.84 }, { scale: 1.0, force3D: true, ease: 'Sine.easeOut', delay: delay });

        setTimeout(this._playBodymovin, 500);

        this._el.addEventListener('mouseenter', this._playBodymovin);
    }

    _deactivate(delay, direction) {
        TweenLite.killTweensOf(this._el);

        TweenLite.to(this._el, 0.62, { alpha: 0.0, ease: 'Sine.easeInOut', delay: delay });
        TweenLite.to(this._el, 0.56, { scale: 0.76, force3D: true, ease: 'Cubic.easeIn', delay: delay });

        this._el.removeEventListener('mouseenter', this._playBodymovin);
    }
}
