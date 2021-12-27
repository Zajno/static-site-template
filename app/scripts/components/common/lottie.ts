import type { LottiePlayer, AnimationConfigWithPath, AnimationItem } from 'lottie-web';
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
    hideOnDeactivate?: boolean | 'first';
};

const LottieLoader = () => import('lottie-web') as Promise<any>;
let LottieLibLoading: Promise<LottiePlayer>;

async function loadLottie() {
    if (!LottieLibLoading) {
        logger.log('Loading library...');
        LottieLibLoading = LottieLoader();
        LottieLibLoading.then(() => logger.log('Library has been loaded'));
    }
    return LottieLibLoading;
}

export default class LottieComponent extends LazyLoadComponent<LottieComponentConfig> {
    private _params: AnimationConfigWithPath;
    private _isCompleted: boolean = true;
    private _anim: AnimationItem;

    private _isLoaded: boolean = false;
    private _playPending: boolean = false;

    private _lottie: LottiePlayer;

    public get animation(): AnimationItem { return this._anim; }

    async doSetup() {
        this.useDefaultConfig({ register: true, loop: true, hideOnDeactivate: true, autoplay: true });

        this._params = {
            container: this.element,
            renderer: 'svg',
            loop: this._config.loop,
            autoplay: this._config.autoplay,
            path: this.element.dataset.lottiePath,
        };

        if (this._config.hideOnDeactivate) {
            gsap.set(this.element, { autoAlpha: 0.0 });
        } else {
            gsap.set(this.element, { autoAlpha: 1.0 });
        }

        await super.doSetup();
    }

    get priority() {
        return this._priority || 3;
    }

    protected async _doLoading(): Promise<void> {
        this._lottie = await loadLottie();

        this._anim = this._lottie.loadAnimation(this._params);
        this._anim.addEventListener('complete', () => {
            this._isCompleted = true;
        });

        if (this._anim.isLoaded) {
            this._isLoaded = true;
            return Promise.resolve();
        }

        await new Promise<void>(resolve => {
            this._anim.addEventListener('DOMLoaded', () => {
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
        if (!this._anim) {
            return;
        }

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
        this._anim?.goToAndStop(0);
        this._isCompleted = false;
    }

    protected async _activate() {
        if (this._config.hideOnDeactivate) {
            const skip = this._config.hideOnDeactivate === 'first' && this.wasActive;
            if (!skip) {
                await this.showByAlpha();
            }
        }

        this._play();
    }

    protected async _deactivate() {
        if (this._config.hideOnDeactivate === true) {
            await this.hideByAlpha();
        }

        this._stop();
    }

    private async showByAlpha() {
        gsap.killTweensOf(this.element);
        await gsap.set(
            this.element,
            { autoAlpha: 1, delay: this.activationConfig?.delay || 0 },
        );
    }

    private async hideByAlpha() {
        gsap.killTweensOf(this.element);
        await gsap.set(this.element,
            { autoAlpha: 0, delay: this.activationConfig?.delay || 0 },
        );
    }
}
