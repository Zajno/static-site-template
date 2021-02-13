import lottie, { AnimationConfigWithPath, AnimationItem } from 'lottie-web';
import gsap from 'gsap';

import LazyLoadComponent from 'app/components/lazy/lazyLoadComponent';
import { ImageLazyLoadConfig } from '../lazy/imageLazyLoadComponent';
import { createLogger } from 'app/logger';

const logger = createLogger('[LottieComponent]');

export type LottieComponentConfig = ImageLazyLoadConfig & {
    /** @default true */
    loop?: boolean;
    /** @default true */
    autoplay?: boolean;
    /** @default true */
    fade?: boolean | 'first';
};

export default class LottieComponent extends LazyLoadComponent<LottieComponentConfig> {
    private _params: AnimationConfigWithPath;
    private _isCompleted: boolean = true;
    private _anim: AnimationItem;

    private _isLoaded: boolean = false;
    private _playPending: boolean = false;

    // SETUP -------------------------------------------------------------------

    async doSetup() {
        this.useDefaultConfig({ register: true, loop: true, fade: true, autoplay: true });

        this._params = {
            container: this.element,
            renderer: 'svg',
            loop: this._config.loop,
            autoplay: this._config.autoplay,
            path: this.element.dataset.lottiePath,
        };

        if (this._config.fade) {
            gsap.set(this.element, { autoAlpha: 0.0 });
        } else {
            gsap.set(this.element, { autoAlpha: 1.0 });
        }

        await super.doSetup();
    }

    get priority() {
        return this._priority || 3;
    }

    protected _doLoading(): Promise<void> {
        this._anim = lottie.loadAnimation(this._params);
        this._anim.addEventListener('complete', () => {
            // this._animBodymovin.goToAndStop(0);
            this._isCompleted = true;
        });

        if (this._anim.isLoaded) {
            this._isLoaded = true;
            return Promise.resolve();
        }

        return new Promise(resolve => {
            this._anim.addEventListener('DOMLoaded', () => {
                logger.log('DOMLoaded', this._playPending, this._anim);

                this._isLoaded = true;
                if (this._playPending) {

                    this._playPending = false;
                    setTimeout(() => {
                        logger.log('Play Pending', this);
                    }, 500);
                    this._anim.play();
                }

                resolve();
            });
        });
    }

    private _play = () => {
        if (this._isLoaded) {
            if (this._isCompleted) {
                this._anim.goToAndStop(0);
                this._isCompleted = false;
            }
            this._anim.play();
        } else {
            this._playPending = true;
        }
    };

    private _stop() {
        this._anim.goToAndStop(0);
        this._isCompleted = false;
    }

    protected async _activate() {
        if (this._config.fade) {
            const skip = this._config.fade === 'first' && this.wasActive;
            if (!skip) {
                await this.fadeIn();
            }
        }

        this._play();
    }

    protected async _deactivate() {
        if (this._config.fade === true) {
            await this.fadeOut();
        }

        this._stop();
    }

    private async fadeIn() {
        gsap.killTweensOf(this.element);
        await gsap.fromTo(this.element, 0,
            { autoAlpha: 0 },
            { autoAlpha: 1, delay: this.activationConfig?.delay || 0 },
        );
    }

    private async fadeOut() {
        gsap.killTweensOf(this.element);
        await gsap.fromTo(this.element, 0,
            { autoAlpha: 1 },
            { autoAlpha: 0, delay: this.activationConfig?.delay || 0 },
        );
    }
}
