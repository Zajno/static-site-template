import logger from 'logger';

import { SUPPORT_MIX_BLEND as supportMixBlend }  from 'utils/constants';

import LazyLoadComponent from '../lazy/lazyLoadComponent';
import ImageLazyLoadComponent from '../lazy/imageLazyLoadComponent';

const States = {
    Undefined: 0,
    LoadAllowed: 1,
    Loaded: 2,
    Paused: 3,
    Playing: 4,
};

const SCREEN_WIDTH_FOR_VIDEOS = 1024;

const lazyClass = 'lazy';

function getObjectDataSrc(source) {
    const data = {};

    let minWidth = Number.MAX_VALUE;
    let fallbackLink = null;

    Object.keys(source.dataset).forEach(function (dataSrc) {
        if (/^src/.test(dataSrc)) {
            const key = dataSrc.substr(3);
            const width = (+key) || 0;
            const link = source.dataset[dataSrc];
            data[width] = link;

            if (width < minWidth) {
                fallbackLink = link;
                minWidth = width;
            }
        }

    });

    if (!data['0']) {
        data['0'] = fallbackLink || '#';
    }

    // logger.log('getObjectDataSrc', data);
    return data;
}


function srcSet(source, width) {
    let currentBreakPoint = 0;

    if (!source.srcSet) {
        source.srcSet = getObjectDataSrc(source);
    }

    const data = source.srcSet;
    Object.keys(data).forEach(function (breakpoint) {
        if (breakpoint >= currentBreakPoint && width >= breakpoint) {
            currentBreakPoint = breakpoint;
            // logger.log(currentBreakPoint);
        }
    });
    // logger.log(data[currentBreakPoint]);
    return data[currentBreakPoint];
}

export default class Video extends LazyLoadComponent {
    // SETUP -------------------------------------------------------------------

    _setup(config) {
        /** @type {HTMLVideoElement} */
        this._el;
        this._widthVieport;

        if (config.register == null) {
            config.register = true;
        }

        super._setup(config);

        this._state = States.Undefined;
        this._requestedState = States.Undefined;

        /** @type {HTMLImageElement} */
        this._placeHolder = this._el.parentElement.querySelector('.video-placeholder');
        this._hasPlaceholder = this._placeHolder != null
            && this._el.classList.contains('has-placeholder-mobile');

        this._hasMixBlend = this._el.classList.contains('has-mix-blend');

        this._placeHoldersLoaded = false;

        this._sources = this._el.querySelectorAll('source');

        this._logId = this._el.id;

    }

    _checkIsSourceChanged(doReplace = false) {
        let isChanged = false;

        for (let i = 0; i < this._sources.length; ++i) {
            const source = this._sources[i];
            const targetSrc = srcSet(source, this._widthVieport);
            if (source.targetSrc !== targetSrc) {
                this.log(`Changing source ${source.src} to ${targetSrc}`);
                if (doReplace) {
                    source.targetSrc = targetSrc;
                    source.src = targetSrc;
                    isChanged = true;
                } else {
                    return true;
                }
            }
        }

        return isChanged;
    }

    async _enableVideo() {
        // this.log('initVideos: videos!');

        // HIDE ALL PLACEHOLDERS
        if (this._placeHolder) {
            this._placeHolder.hidden = true;
        }

        // SHOW VIDEO
        this._el.hidden = false;

        const isChanged = this._checkIsSourceChanged(true);

        // this.log('[VIDEO] Switching to Video');

        if (isChanged) {
            this._el.classList.add(lazyClass);

            const loadPromise = new Promise(resolve => {

                const onVideoCanPlay = () => {
                    if (this._state <= States.LoadAllowed) {
                        this._el.removeEventListener('canplay', onVideoCanPlay);
                        this._switchToState(States.Loaded);

                        resolve();
                    }
                };

                this._el.addEventListener('canplay', onVideoCanPlay);

                // this.log('[VIDEO] Loading...');

                this._el.load();
            });
            await loadPromise;
        }

        // play video in case we;re active
        if (this._active) {
            await this._switchToState(States.Playing);
        }
    }

    async _enablePlaceholders() {
        // this.log('initVideos: images!');

        // SHOW ALL PLACEHOLDERS
        this._placeHolder.hidden = false;

        // HIDE VIDEO
        this._el.hidden = true;

        await this._switchToState(States.Paused);

        if (!this._placeHoldersLoaded) {

            this.log('Switching to Placeholders');
            this._placeHolder.classList.add(lazyClass);
            const lazy = new ImageLazyLoadComponent({ el: this._placeHolder, register: true });

            this._placeHoldersLoaded = true;
        }
    }

    async _switchToState(targetState) {
        if (targetState < States.LoadAllowed) {
            throw new Error('Invalid state');
        }

        if (targetState > States.Loaded && this._state < States.Loaded) {
            this._requestedState = targetState;
            this.log('ignoring state =', targetState, ' when current state =', this._state);
            return;
        }

        // check if we're on this state already
        if (targetState === this._state) {
            return;
        }

        // if we're in state changing progress
        if (this._changingState) {
            this._requestedState = targetState;
            return;
        }

        // perform the transition
        this._changingState = true;
        switch (targetState) {
            case States.Playing: {
                await this._el.play();
                // this.log('played');
                break;
            }

            case States.Paused: {
                this._el.pause();
                this.log('paused');
                break;
            }

            case States.LoadAllowed: {
                this.log('LOAD ALLOWED');
                break;
            }

            case States.Loaded: {
                this.log('LOADED');
                break;
            }

            default: {
                throw new Error('Unhandled targetState:', targetState);
            }
        }
        this._changingState = false;

        this._state = targetState;
        const nextState = this._requestedState;
        this._requestedState = null;

        if (nextState && nextState !== this._state) {
            this._switchToState(nextState);
        }
    }

    async _load() {
        if (this._usePlaceholder == null) {
            this.log('Skipping load beacuse don\'t know about placeholder');
            return;
        }

        if (this._usePlaceholder) {
            await this._enablePlaceholders();
        } else {
            await this._enableVideo();
        }
    }

    async _doLoading() {
        await this._switchToState(States.LoadAllowed);
        await this._load();
    }

    scroll(scrollDirection, scrollPosition) {
        // TODO Change video playback position ?
    }

    resize(width, height) {
        const isMobile = width <= SCREEN_WIDTH_FOR_VIDEOS;
        const usePlaceholder = !!((this._hasPlaceholder && isMobile)
            || (this._hasMixBlend && !supportMixBlend));

        this._widthVieport = width;

        if (this._usePlaceholder === usePlaceholder) {

            if (this._usePlaceholder === false && this._state > States.LoadAllowed) {
                if (this._checkIsSourceChanged()) {
                    this._doLoading();
                    return;
                }
            }

            return;
        }

        this._usePlaceholder = usePlaceholder;

        if (this._state >= States.LoadAllowed) {
            this._load();
        }

    }

    // STATE -------------------------------------------------------------------

    _activate(delay, direction) {
        this._switchToState(States.Playing);
    }

    _deactivate(delay, direction) {
        this._switchToState(States.Paused);
    }

    log(...args) {
        if (this._logId) {
            logger.log(`[VIDEO = ${this._logId}]`, ...args);
        }
    }
}
