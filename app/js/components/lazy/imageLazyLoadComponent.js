import logger from 'logger';
import createReadyPattern from 'utils/readyPattern';

import LazyLoadComponent from './lazyLoadComponent';

const LOG_ENABLED = false;

function log(...args) {
    if (LOG_ENABLED) {
        logger.log(...args);
    }
}

export default class ImageLazyLoadComponent extends LazyLoadComponent {

    constructor(config) {
        super(config);

        /** @type {HTMLImageElement} */
        this._el;
    }

    _setup(config) {

        /** @type {HTMLPictureElement} */
        this._picture = window.HTMLPictureElement && this._el.parentElement.tagName.toLowerCase() === 'picture'
            ? this._el.parentElement
            : null;

        if (!this._el.classList.contains('lazy')) {
            this._el.classList.add('lazy');
        }

        super._setup(config);
    }

    _doImageLoading() {
        /** @type {HTMLImageElement} */
        const target = this._el;

        const targetSrc = target.dataset.src;
        // log('[ImageLazyLoadComponent]', target.complete, targetSrc, target);

        if (!targetSrc && target.complete) {
            return Promise.resolve();
        }

        const onReady = createReadyPattern(target);

        return new Promise(resolve => {
            const resolveWrapper = ok => {
                log('resolve', ok, this._el);
                resolve();
            };

            if (targetSrc) {
                target.src = targetSrc;
            }

            onReady(resolveWrapper);
        });
    }

    _doPictureLoading() {

        /** @type {HTMLImageElement} */
        const target = this._el;

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
                log('picture resolve', ok, this._el.currentSrc, this._el);
                resolve();
            };

            onReady(resolveWrapper);
        });
    }

    _doLoading() {
        return this._picture
            ? this._doPictureLoading()
            : this._doImageLoading();
    }

    /**
     * @param {string} selector
     * @returns {ImageLazyLoadComponent[]}
     */
    static RegisterAll(selector = 'img.lazy') {
        return document.querySelectorAll(selector)
            .map(el => new ImageLazyLoadComponent({ el, register: true }));
    }
}
