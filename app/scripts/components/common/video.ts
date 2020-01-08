import logger from 'app/logger';

import { SUPPORT_MIX_BLEND as supportMixBlend }  from 'app/utils/constants';

import LazyLoadComponent, { LazyLoadConfig } from 'app/components/lazy/lazyLoadComponent';
import ImageLazyLoadComponent from 'app/components/lazy/imageLazyLoadComponent';

const enum States {
    Undefined = 0,
    LoadAllowed = 1,
    Loaded = 2,
    Paused = 3,
    Playing = 4,
}

export type VideoConfig = LazyLoadConfig & {
    el: HTMLVideoElement,
};

type VideoSource = HTMLSourceElement & {
    targetSrc?: string;
    srcSet?: {};
};

const SCREEN_WIDTH_FOR_VIDEOS = 1024;
const lazyClass = 'lazy';

function getObjectDataSrc(source: VideoSource) {
    const data: { [breakpoint: number]: string } = {};

    let minWidth = Number.MAX_VALUE;
    let fallbackLink = null;

    Object.keys(source.dataset).forEach((dataSrc) => {
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

    logger.log('getObjectDataSrc', data);
    return data;
}

function srcSet(source: VideoSource, width: number) {
    let currentBreakPoint = 0;

    if (!source.srcSet) {
        source.srcSet = getObjectDataSrc(source);
    }

    const data = source.srcSet;
    Object.keys(data).forEach(key => {
        const breakpoint = +key;
        if (breakpoint >= currentBreakPoint && width >= breakpoint) {
            currentBreakPoint = breakpoint;
        }
    });
    return data[currentBreakPoint];
}

export default class Video extends LazyLoadComponent<VideoConfig> {

    private _widthVieport: number;
    private _state: States;
    private _requestedState: States;
    private _changingState: boolean;

    private _placeHolder: HTMLImageElement;
    private _hasPlaceholder: boolean;
    private _usePlaceholder?: boolean;

    private _hasMixBlend: boolean;
    private _placeHoldersLoaded: boolean;

    private _sources: VideoSource[];
    private _logId: string;

    constructor(config: VideoConfig) {
        if (config.register == null) {
            config.register = true;
        }

        super(config);
    }

    get video() { return this.element as HTMLVideoElement; }

    protected async doSetup() {
        this._state = States.Undefined;
        this._requestedState = States.Undefined;

        this._placeHolder = this.element.parentElement.querySelector('.video-placeholder');
        this._hasPlaceholder = this._placeHolder != null
            && this.element.classList.contains('has-placeholder-mobile');

        if (!this._hasPlaceholder) {
            this._usePlaceholder = false;
        }

        this._hasMixBlend = this.element.classList.contains('has-mix-blend');

        this._placeHoldersLoaded = false;

        this._sources = Array.from(this.element.querySelectorAll('source'));

        this._logId = this.element.id;

        await super.doSetup();
    }

    private _checkIsSourceChanged(doReplace = false) {
        let isChanged = false;
        this.log('_checkIsSourceChanged', this.element, this._sources);
        for (let i = 0; i < this._sources.length; ++i) {
            const source = this._sources[i];
            const targetSrc = srcSet(source, this._widthVieport);
            this.log(`Changing source ${source.src} to ${targetSrc}`);
            if (source.targetSrc !== targetSrc) {
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

    private async _enableVideo() {
        // this.log('initVideos: videos!');

        // HIDE ALL PLACEHOLDERS
        if (this._placeHolder) {
            this._placeHolder.hidden = true;
            this.video.hidden = false;
        }

        const isChanged = this._checkIsSourceChanged(true);

        this.log('[VIDEO] Switching to Video, isChanged =', isChanged);

        if (isChanged) {
            this.video.classList.add(lazyClass);

            const loadPromise = new Promise(resolve => {

                const onVideoCanPlay = () => {
                    if (this._state <= States.LoadAllowed) {
                        this.video.removeEventListener('canplay', onVideoCanPlay);
                        this._switchToState(States.Loaded);

                        resolve();
                    }
                };

                this.video.addEventListener('canplay', onVideoCanPlay);

                this.log('[VIDEO] Loading...');

                this.video.load();
            });
            await loadPromise;
        }

        // play video in case we're active
        if (this.isActive) {
            await this._switchToState(States.Playing);
        }
    }

    private async _enablePlaceholders() {
        // this.log('initVideos: images!');

        // SHOW ALL PLACEHOLDERS
        this._placeHolder.hidden = false;

        // HIDE VIDEO
        this.video.hidden = true;

        await this._switchToState(States.Paused);

        if (!this._placeHoldersLoaded) {

            this.log('Switching to Placeholders');
            this._placeHolder.classList.add(lazyClass);
            const lazy = new ImageLazyLoadComponent({ el: this._placeHolder, register: true });

            this._placeHoldersLoaded = true;
        }
    }

    private async _switchToState(targetState: States) {
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
                await this.video.play();
                // this.log('played');
                break;
            }

            case States.Paused: {
                this.video.pause();
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
                throw new Error('Unhandled targetState: ' + targetState);
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

    private async _load() {
        if (this._usePlaceholder == null) {
            this.log('Skipping load beacuse don\'t know about placeholder. Try to call resize first!');
            return;
        }

        if (this._usePlaceholder) {
            await this._enablePlaceholders();
        } else {
            await this._enableVideo();
        }
    }

    protected async _doLoading() {
        await this._switchToState(States.LoadAllowed);
        await this._load();
    }

    scroll(scrollDirection, scrollPosition) {
        // TODO Change video playback position ?
    }

    resize(width: number, height: number) {
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

    protected _activate(delay, direction) {
        this.register();
        this._switchToState(States.Playing);
    }

    protected _deactivate(delay, direction) {
        this._switchToState(States.Paused);
    }

    private log(...args: any[]) {
        if (this._logId) {
            logger.log(`[VIDEO = ${this._logId}]`, ...args);
        }
    }
}
