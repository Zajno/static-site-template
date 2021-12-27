import { createLogger } from 'app/logger';
import { Event } from '@zajno/common/lib/event';

const logger = createLogger('[Breakpoints]');

export type BreakpointAnimations = {
    disableInview?: boolean,
    disableVideo?: boolean,
};

export type BreakpointData = {
    id: number;
    name: string,
    mediaQuery: string;
    width: number;
    height: number;
    animations?: BreakpointAnimations;
};

const Breakpoints: [BreakpointData] = [
    {
        id: 500,
        name: 'default',
        mediaQuery: '',
        width: 1440,
        height: 800,
    },
];

function calcRem(width: number, height: number, breakpoint: BreakpointData) {
    const ab = breakpoint.width / breakpoint.height;
    const avp = width / height;

    const rem = ab < avp
        ? (height / breakpoint.height)
        : (width / breakpoint.width);

    return rem;
}

const _internal = {
    width: 0,
    height: 0,
    currentBreakpoint: null as BreakpointData,
    currentRem: 0.0,
};

const _remChanged = new Event<number>();
const _breakpointChanged = new Event<BreakpointData>();

export default {

    registerBreakpoint(bp: BreakpointData) {
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

        get width() { return _internal.width; },
        get height() { return _internal.height; },

        get breakpointChanged() { return _breakpointChanged.expose(); },

        get remChanged() { return _remChanged.expose(); },
    },

    resize(width: number, height: number) {
        let bp = Breakpoints.find(b => window.matchMedia(b.mediaQuery).matches);
        if (!bp) {
            bp = Breakpoints[0];
        }

        _internal.width = width;
        _internal.height = height;

        const rem = calcRem(width, height, bp);

        logger.log('Current breakpoint:', `[${width}x${height}]`, bp, '; rem =', rem);

        if (!_internal.currentBreakpoint || _internal.currentBreakpoint.id !== bp.id) {
            _internal.currentBreakpoint = bp;
            _breakpointChanged.trigger(bp);
        }

        if (_internal.currentRem !== rem) {
            _internal.currentRem = rem;
            _remChanged.trigger(rem);
        }
    },
};
