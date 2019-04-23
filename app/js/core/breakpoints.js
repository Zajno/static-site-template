import { observable } from 'mobx';
import { createLogger } from 'app/logger';

/** @typedef {Object} Breakpoint
 * @property {number} id as ID
 * @property {string} mediaQuery
 * @property {number} width
 * @property {number} height
 */

const logger = createLogger('[Breakpoints]');

/** @type {Breakpoint[]} */
const Breakpoints = [
    // default
    {
        id: 500,
        mediaQuery: '',
        width: 1440,
        height: 800,
    },
];

/**
 * @param {number} width
 * @param {number} height
 * @param {Breakpoint} breakpoint
 * @returns {number}
 */
function calcRem(width, height, breakpoint) {
    const ab = breakpoint.width / breakpoint.height;
    const avp = width / height;

    const rem = ab < avp
        ? (height / breakpoint.height)
        : (width / breakpoint.width);

    return rem;
}


const _internal = observable.object({
    /** @type {Breakpoint} */
    currentBreakpoint: null,
    /** @type {number} */
    currentRem: 0.0,
});

export default observable.object({

    /** @param {Breakpoint} bp */
    registerBreakpoint(bp) {
        const existing = Breakpoints.findIndex(b => b.id === bp.id);
        if (existing >= 0) {
            Breakpoints[existing] = bp;
        } else {
            Breakpoints.push(bp);
            Breakpoints.sort((b1, b2) => b1.id - b2.id);
        }
    },

    Current: {
        get breakpoint() { return _internal.currentBreakpoint; },

        get rem() { return _internal.currentRem; },
    },

    resize(width, height) {
        let bp = Breakpoints.find(b => window.matchMedia(b.mediaQuery).matches);
        if (!bp) {
            bp = Breakpoints[0];
        }

        const rem = calcRem(width, height, bp);

        logger.log('Current breakpoint:', `[${width}x${height}]`, bp, '; rem =', rem);

        if (!_internal.currentBreakpoint || _internal.currentBreakpoint.id !== bp.id) {
            _internal.currentBreakpoint = bp;
        }

        _internal.currentRem = rem;
    },
});
