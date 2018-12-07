import { observable } from 'mobx';
import Breakpoints from 'app/core/breakpoints';

/** @typedef {(import 'app/core/breakpoints').Breakpoint} BreakpointBase */

/** @typedef {BreakpointBase} AppBreakpoint */

// TODO register additional breakpoints

const AppBreakpoints = {
    Desktop: {
        id: 3,
        width: 1440,
        height: 800,
        mediaQuery: '(max-width: 1920px)',
    },
};

Breakpoints.registerBreakpoint(AppBreakpoints.Desktop);

const _internal = observable.object({
    width: 0,
    height: 0,
});

export default observable.object({
    get All() { return AppBreakpoints; },

    Current: {
        /** @returns {AppBreakpoint} */
        get breakpoint() { return Breakpoints.Current.breakpoint; },

        get rem() { return Breakpoints.Current.rem; },
    },

    get width() { return _internal.width; },

    get height() { return _internal.height; },

    resize(width, height) {
        _internal.width = width;
        _internal.height = height;

        Breakpoints.resize(width, height);
    },
});
