import {
    BreakpointData as BreakpointBaseData,
    BreakpointsManager,
    ICurrentBreakpointInfo,
} from '@zajno/common-web/lib/breakpoints';

// TODO define & register additional breakpoints for your app

export enum BreakpointType {
    Desktop = 'Desktop',
    Tablet = 'Tablet',
    Mobile = 'Mobile',
}

type BreakpointData = BreakpointBaseData<BreakpointType>;

const AppBreakpoints: Record<BreakpointType, BreakpointData> = {
    Desktop: {
        id: 3,
        name: BreakpointType.Desktop,
        width: 1440,
        height: 0,
        mediaQuery: '(min-width: 1025px)',
    },
    Tablet: {
        id: 2,
        name: BreakpointType.Tablet,
        width: 768,
        height: 0,
        mediaQuery: '(min-width: 481px) and (max-width: 1024px)',
    },
    Mobile: {
        id: 1,
        name: BreakpointType.Mobile,
        width: 375,
        height: 0,
        mediaQuery: '(max-width: 480px)',
    },
};

const Manager = new BreakpointsManager<BreakpointType>();

Manager.registerBreakpoint(AppBreakpoints.Desktop);
Manager.registerBreakpoint(AppBreakpoints.Tablet);
Manager.registerBreakpoint(AppBreakpoints.Mobile);

// that's just a wrapper for core Breakpoints, nothing else should be added here
export const Breakpoints = {
    get All(): Readonly<typeof AppBreakpoints> { return AppBreakpoints; },

    get Current(): ICurrentBreakpointInfo { return Manager; },

    resize(width: number, height: number) { return Manager.resize(width, height); },

    isActive(...breakpointsIds: number[]) {
        return breakpointsIds.includes(this.Current.breakpoint.id);
    },
};
