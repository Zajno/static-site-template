import Breakpoints, { BreakpointData } from 'app/core/breakpoints';

// TODO define & register additional breakpoints for your app

export enum BreakpointType {
    Desktop = 'Desktop',
}

const AppBreakpoints: Record<BreakpointType, BreakpointData> = {
    Desktop: {
        id: 3,
        name: BreakpointType.Desktop,
        width: 1440,
        height: 800,
        mediaQuery: '(max-width: 1920px)',
    },
};

Breakpoints.registerBreakpoint(AppBreakpoints.Desktop);

// that's just a wrapper for core Breakpoints, nothing else should be added here
export default {
    get All(): Readonly<typeof AppBreakpoints> { return AppBreakpoints; },

    get Current() { return Breakpoints.Current; },

    isActive(...breakpointsIds: number[]) {
        return breakpointsIds.includes(this.Current.breakpoint.id);
    },
};
