import { TimelineMax, Power1 } from 'gsap';
import { createLogger } from 'logger';
import Component from 'app/core/component';

/** @typedef {Object} PathTransition
 * @property {string} path
 * @property {boolean} [yoyo=false]
 * @property {number} [repeat=0]
 * @property {gsap.Ease} [ease=Power1]
 * @property {number} [duration=DEFAULT_DURATION]
*/

/**
 * @typedef {Object} StateDefinition
 * @property {string} id
 * @property {PathTransition[]} paths
 * @property {boolean} [isDefault=false]
 * @property {number} [repeat=0]
 * @property {boolean} [yoyo=false]
 * @property {number} [timescale=1]
 */

/** @typedef {Object} SvgMorphConfig
 * @property {HTMLElement} el
 * @property {StateDefinition[]} states
 * @property {boolean} [enableLogs=false]
 */

const DEFAULT_DURATION = 1;

export default class SvgMorph extends Component {
    /** @param {SvgMorphConfig} config */
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);

        this._onFinish = this._onFinish.bind(this);
    }

    /** @param {SvgMorphConfig} config */
    _setup(config) {

        this._logger = config.enableLogs
            ? createLogger(`[SVGMorph@${this._el.nodeName}#${this._el.id}]`)
            : createLogger('', true);

        /** @type {Object.<string,StateDefinition>} */
        this._states = {};
        /** @type {StateDefinition} */
        this._default = null;

        (config.states || []).forEach(s => {
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

        /** @type {StateDefinition} */
        this._current = null;

        this._timeLine = new TimelineMax();
    }

    reset() {
        this._current = null;
        this._timeLine.clear();

        this._resolveFinish();
    }

    /**
     * @param {string} stateId
     * @returns {Promise}
     */
    goTo(stateId) {
        const nextState = this._states[stateId];

        if (!nextState) {
            this._logger.error('invalid state id', stateId);
            return Promise.reject(new Error('Unknown state'));
        }

        this._logger.log('go to state', nextState.id);

        return this._goTo(nextState);
    }

    /** @param {StateDefinition} state
     * @returns {Promise}
    */
    _goTo(state) {
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
                .to(this._el, p.duration,
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

        this._logger.log('starting TL id =', this._current.id, ' endless =', endless, ', repeat =', this._timeLine.repeat(), ', yoyo =', this._timeLine.yoyo());

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

    _onFinish(allowDefault = true) {

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
