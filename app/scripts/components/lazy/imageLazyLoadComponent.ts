import logger from 'app/logger';
import createReadyPattern from 'app/utils/readyPattern';

import LazyLoadComponent, { LazyLoadConfig } from './lazyLoadComponent';

const LOG_ENABLED = false;

function log(...args) {
    if (LOG_ENABLED) {
        logger.log(...args);
    }
}

export interface ImageLazyLoadConfig extends LazyLoadConfig {
    el: HTMLImageElement;
}

export default class ImageLazyLoadComponent extends LazyLoadComponent<ImageLazyLoadConfig> {
   private _picture: HTMLPictureElement;

    get image() { console.log(this._config.el);
        return this._config.el; }
    _setup() {
        console.log('start setup')
        this._picture = window.HTMLPictureElement && this.element.parentElement.tagName.toLowerCase() === 'picture'
            ? this.element.parentElement
            : null;

        if (!this.element.classList.contains('lazy')) {
            this.element.classList.add('lazy');
        }

        this.setup();
    }

    _doImageLoading(): Promise<void> {
        const target = this.image;
        console.log(this.image, '_doImageLoading');
        const targetSrc = target.dataset.src;
        // log('[ImageLazyLoadComponent]', target.complete, targetSrc, target);

        if (!targetSrc && target.complete) {
            return Promise.resolve();
        }

        const onReady = createReadyPattern(target);

        return new Promise(resolve => {
            const resolveWrapper = ok => {
                log('resolve', ok, this.element);
                resolve();
            };

            if (targetSrc) {
                target.src = targetSrc;
            }

            onReady(resolveWrapper);
        });
    }

    _doPictureLoading(): Promise<void> {

        const target = this.image;

        const onReady = createReadyPattern(target);

        let hasTargetSrc = false;

        /** @type {HTMLSourceElement[]} */
        const sources = this._picture.querySelectorAll('source');
        sources.forEach(s => {
            if (s.dataset.srcset) {
                s.srcset = s.dataset.srcset;
                hasTargetSrc = true;
            }
        });

        if (!hasTargetSrc && target.complete) {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            const resolveWrapper = ok => {
                log('picture resolve', ok, this.image.currentSrc, this.element);
                resolve();
            };

            onReady(resolveWrapper);
        });
    }

    _doLoading(): Promise<void> {

        return Promise.resolve(this._picture
            ? this._doPictureLoading()
            : this._doImageLoading());
    }

    /**
     * @param {string} selector
     * @returns {ImageLazyLoadComponent[]}
     */

    static RegisterAll(selector = 'img.lazy') {
        const  arrImage = document.querySelectorAll(selector);
        return arrImage
            .map(el => new ImageLazyLoadComponent({ el: el as HTMLImageElement, register: true }));
    }
}
