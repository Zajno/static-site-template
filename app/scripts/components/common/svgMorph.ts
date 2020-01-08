import GSAP, { TimelineMax, Power1 } from 'gsap';
import { createLogger, ILogger } from 'app/logger';
import Component, { ComponentConfig } from 'app/core/component';

type PathTransition = {
    path: string,
    yoyo?: boolean,
    repeat?: number,
    ease?: string | gsap.EaseFunction,
    duration?: number,
};

type StateDefinition = {
    id: string,
    paths: PathTransition[],
    isDefault?: boolean,
    repeat?: number,
    yoyo?: boolean,
    timescale?: number,
};

export type SvgMorphConfig = ComponentConfig & {
    states: StateDefinition[],
    enableLogs?: boolean,
};

const DEFAULT_DURATION = 1;

export default class SvgMorph extends Component<SvgMorphConfig> {

    private _logger: ILogger;
    private _states: { [s: string]: StateDefinition };

    private _default: StateDefinition;
    private _current: StateDefinition;

    private _timeLine: TimelineMax;
    private _currentResolve: () => void;

    async doSetup() {
        this._logger = this._config.enableLogs
            ? createLogger(`[SVGMorph@${this.element.nodeName}#${this.element.id}]`)
            : createLogger('', true);

        this._states = {};
        this._default = null;

        (this._config.states || []).forEach(s => {
            s.paths = s.paths || [];
            s.paths.forEach(p => {
                p.yoyo = p.yoyo == null ? false : p.yoyo;
                p.repeat = p.repeat == null ? 0 : p.repeat;
                p.duration = p.duration == null ? DEFAULT_DURATION : p.duration;
                p.ease = p.ease || Power1.easeInOut;
            });

            s.repeat = s.repeat == null ? 0 : s.repeat;
            s.yoyo = s.yoyo == null ? false : s.yoyo;
            s.timescale = s.timescale == null ? 1 : s.timescale;

            this._states[s.id] = s;

            if (s.isDefault) {
                this._default = s;
            }
        });

        this._current = null;
        this._timeLine = new TimelineMax();
    }

    reset() {
        this._current = null;
        this._timeLine.clear();

        this._resolveFinish();
    }

    goTo(stateId: string): Promise<void> {
        const nextState = this._states[stateId];

        if (!nextState) {
            this._logger.error('invalid state id', stateId);
            return Promise.reject(new Error('Unknown state'));
        }

        this._logger.log('go to state', nextState.id);

        return this._goTo(nextState);
    }

    _goTo(state: StateDefinition): Promise<void> {
        if (this._current && this._current.id === state.id) {
            this._logger.log('go to state skipped, already there:', state.id);
            return Promise.resolve();
        }

        this.reset();

        this._logger.log('switching to state', state);
        this._current = state;

        let endless = false;

        for (let index = 0; index < this._current.paths.length; ++index) {
            const p = this._current.paths[index];

            endless = endless || (p.repeat < 0);

            this._timeLine
                .to(this.element, p.duration,
                    {
                        attr: {
                            d: p.path,
                        },
                        repeat: p.repeat,
                        yoyo: p.yoyo,
                        ease: p.ease,
                    });
        }

        this._timeLine.yoyo(this._current.yoyo);
        this._timeLine.repeat(this._current.repeat);
        this._timeLine.timeScale(this._current.timescale);

        endless = endless || this._timeLine.repeat() < 0;

        this._logger.log(
            'starting TL id =', this._current.id, ' endless =', endless, ', repeat =', this._timeLine.repeat(), ', yoyo =', this._timeLine.yoyo(),
        );

        if (!endless) {
            this._timeLine.add(this._onFinish);

            return new Promise(resolve => {
                this._currentResolve = resolve;
            });
        }

        return Promise.resolve();
    }

    _resolveFinish() {
        if (this._currentResolve) {
            const resolve = this._currentResolve;
            this._currentResolve = null;
            resolve();
        }
    }

    _onFinish = (allowDefault = true) => {

        this._logger.log('_onFinish; allowDefault =', allowDefault, 'state =', this._current ? this._current.id : '<null>');

        this._resolveFinish();

        if (allowDefault && this._default) {
            this._goTo(this._default);
        }
    }

    _deactivate() {
        this.reset();
    }
}
