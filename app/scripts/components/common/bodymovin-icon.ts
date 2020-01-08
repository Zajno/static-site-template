
import lottie, { AnimationConfig, AnimationItem as AnimationItemLottie } from 'lottie-web';
import GSAP from 'gsap';

import LazyLoadComponent from 'app/components/lazy/lazyLoadComponent';
import { ImageLazyLoadConfig } from '../lazy/imageLazyLoadComponent';
import { createLogger } from 'app/logger';

export type AnimationConfigWithPath = AnimationConfig & {
    path?: string;
};

type AnimationItem = AnimationItemLottie & {
    isLoaded?: boolean;
};

const logger = createLogger('[BodymovinIcon]');

export default class BodymovinIcon extends LazyLoadComponent<ImageLazyLoadConfig> {
    protected _bodymovinParams: AnimationConfigWithPath;
    protected _isComplete: boolean = true;
    private _isLoaded: boolean = false;
    private _playPending: boolean = false;
    protected _animBodymovin: AnimationItem;

    // SETUP -------------------------------------------------------------------

    async doSetup() {
        this._bodymovinParams = {
            container: this.element,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: this.element.dataset.bodymovinPath,
        };

        // this._playBodymovin(false);
        this._playBodymovin = this._playBodymovin.bind(this);

        // this._checkAnimationLoaded();
        GSAP.set(this.element, { alpha: 0.0, force3D: true });

        if (this._config.register == null) {
            this._config.register = true;
        }

        super.doSetup();
    }

    get priority() {
        return this._priority || 3;
    }

    _doLoading(): Promise<void> {

        this._animBodymovin = lottie.loadAnimation(this._bodymovinParams);
        this._animBodymovin.addEventListener('complete', () => {
            // this._animBodymovin.goToAndStop(0);
            this._isComplete = true;
        });

        if (this._animBodymovin.isLoaded) {
            this._isLoaded = true;
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this._animBodymovin.addEventListener('DOMLoaded', () => {
                logger.log('DOMLoaded', this._playPending, this._animBodymovin);

                this._isLoaded = true;
                if (this._playPending) {

                    this._playPending = false;
                    setTimeout(() => {
                        // logger.log('[BodymovinIcon] Play Pending', this);
                        this._animBodymovin.play();
                    }, 500);
                }

                resolve();
            });
        });
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
        GSAP.killTweensOf(this.element);

        // TODO tweak me
        TweenLite.fromTo(this.element, 0.75, { alpha: 0.0 }, { alpha: 1.0, ease: 'Sine.easeInOut', delay: delay });
        // TweenLite.fromTo(this.element, 2.56, { scale: 0.84 }, { scale: 1.0, force3D: true, ease: 'Sine.easeOut', delay: delay });

        setTimeout(this._playBodymovin, 500);
    }

    _deactivate(delay, direction) {
        GSAP.killTweensOf(this.element);

        // TODO tweak me
        TweenLite.to(this.element, 0.62, { alpha: 0.0, ease: 'Sine.easeInOut', delay: delay });
        // TweenLite.to(this.element, 0.56, { scale: 0.76, force3D: true, ease: 'Cubic.easeIn', delay: delay });
    }
}
