import { observable } from 'mobx';
import { createLogger } from 'app/logger';

const logger = createLogger('[Breakpoints]');

type BreakpointType = {
        id: number;
        mediaQuery: string;
        width: number;
        height: number;
    }
;

const Breakpoints: [BreakpointType] = [
    {
        id: 500,
        mediaQuery: '',
        width: 1440,
        height: 800,
    },
];

function calcRem(width, height, breakpoint) {
    const ab = breakpoint.width / breakpoint.height;
    const avp = width / height;

    const rem = ab < avp
        ? (height / breakpoint.height)
        : (width / breakpoint.width);

    return rem;
}

type _internalType = {
    currentBreakpoint: BreakpointType;
    currentRem: number;
};

const _internal: _internalType = observable.object({
    currentBreakpoint: null,
    currentRem: 0.0,
});

export default observable.object({

    registerBreakpoint(bp: BreakpointType) {
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

    resize(width: number, height: number) {
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
