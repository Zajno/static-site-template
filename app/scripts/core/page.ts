import 'app/utils/checkBrowserSupport';

import logger from '@zajno/common/lib/logger';
import Section, { SectionCtor, SectionConfig, Directions, SectionActions } from './section';
import Breakpoints from 'app/core/breakpoints';

export interface IPage {
    readonly width: number;
    readonly height: number;

    readonly scrollPosition: number;
    readonly scrollDirection: number;

    readonly rem: number;
}

type ScrollDirectionHelpers = {
    [k1 in Directions]: {
        [k2 in SectionActions]: (top: number, bottom: number, showThreshold: number) => boolean;
    };
};

export interface PageCtor {
    new(): Page;
}

export default abstract class Page implements IPage {
    private _root: HTMLElement = null;
    private _sections: Section[];

    private _width: number = 0;
    private _height: number = 0;

    private _centerY: number = 0.0;

    private _scrollPosition: number = 0;
    private _scrollDirection: 0 | -1 | 1 = -1;

    private _deltaY: number = 0;
    private _wheelDirection: Directions;

    private _rem: number = 1;

    static async RunPage(PageType: PageCtor) {
        const page = new PageType();
        try {
            await page.setupAsync();
            page.start();
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(`failed to setup page '${PageType.name}':`, err);
        }
    }

    protected abstract get sectionTypes(): SectionCtor[];
    protected get root() { return this._root; }

    get width() { return this._width; }
    get height() { return this._height; }

    get scrollPosition() { return this._scrollPosition; }
    get scrollDirection() { return this._scrollDirection; }

    get centerY() { return this._centerY; }

    get deltaY() { return this._deltaY; }
    get wheelDirection() { return this._wheelDirection; }

    get rem() { return this._rem; }

    protected getSection<TSection extends Section>(index: number) {
        return this._sections[index] as TSection;
    }

    public async setupAsync() {
        this._root = document.getElementById('main')
            || document.getElementsByTagName('body')[0];

        await this.setupPageAsync();
        await this._setupSections(this._root.querySelectorAll('section'));

        await this.afterSetup();

        // subscribe to window events only after the page has been set up
        window.onresize = this.resize.bind(this);
        window.onscroll = this.scroll.bind(this);
        window.onwheel = this.onWheel.bind(this);

        this.resize();
    }

    protected setupPageAsync(): void | Promise<void> {
        /* override me if you want */
    }

    protected afterSetup(): void | Promise<void> {
        /* override me if you want */
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getSectionOptions(index: number, type: SectionCtor, el: HTMLElement): any {
        return { };
    }

    private async _setupSections(sections: ArrayLike<HTMLElement>) {
        this._sections = [];
        const types = this.sectionTypes;

        for (let i = 0; i < sections.length; ++i) {
            const section = sections[i];
            const Type = types[i];
            if (!Type) {
                continue;
            }

            const config = {
                el: section,
                page: this,
                ...this.getSectionOptions(i, Type, section),
            } as SectionConfig;

            const instance = new Type(config);
            this._sections.push(instance);

            await instance.setup();
        }

        logger.log(`Sections (${this._sections.length}):`, this._sections);
    }

    start() {
        /* override me if you want */
    }

    scroll() {
        // this._scrollDirection = scrollDirection;
        const scrollPosition = window.pageYOffset;
        if (this._scrollPosition === scrollPosition) {
            this._scrollDirection = 0.0;
        } else {
            this._scrollDirection = scrollPosition > this._scrollPosition
                ? -1.0
                : 1.0;
        }
        this._scrollPosition = scrollPosition;
        this._updateSections();
    }

    protected resize() {
        this._width = document.body.clientWidth;
        this._height = window.innerHeight;
        this._centerY = this._height * 0.5;

        Breakpoints.resize(this._width, this.height);

        this._rem = Breakpoints.Current.rem;

        for (let i = 0; i < this._sections.length; ++i) {
            this._sections[i].resize(this._width, this._height);
        }

        this.scroll();
    }

    private onWheel(e) {
        this._deltaY = e.deltaY ? e.deltaY : e.originalEvent && e.originalEvent.detail;
        this._wheelDirection = this._deltaY > 0 ? 'down' : 'up';

        this.wheel();
    }

    protected wheel() {
        /* override me if you want */
    }

    private readonly _scrollHelpers: ScrollDirectionHelpers = {
        down: {
            show: (top, bottom, showTreshold) => top <= this._height - showTreshold,
            hide: (top, bottom, hideTreshold) => bottom <= hideTreshold,
        },
        up: {
            show: (top, bottom, showTreshold) => bottom >= showTreshold,
            hide: (top, bottom, hideTreshold) => top > this._height - hideTreshold,
        },
    };

    protected _updateSections() {
        const coeffsDirection: Directions = this._scrollDirection <= 0
            ? 'down' : 'up';

        const getIsShow = this._scrollHelpers[coeffsDirection].show;
        const getIsHide = this._scrollHelpers[coeffsDirection].hide;

        const sectionsNum = this._sections.length;
        for (let i = 0; i < sectionsNum; i++) {
            const section = this._sections[i];
            const { rect } = section;

            const { top, bottom, height } = rect;

            const coeffs = section.scrollCoeffs[coeffsDirection];
            let show = null;

            let showTreshold = this._height * coeffs.show;
            if (section.fallbackTreshold && height < showTreshold) {
                showTreshold = height * section.fallbackTreshold;
            }

            // show if top of next element is in range
            if (getIsShow(top, bottom, showTreshold)) {
                show = true;
            }

            let hideTreshold = this._height * coeffs.hide;
            if (section.fallbackTreshold && height < hideTreshold) {
                hideTreshold = height * section.fallbackTreshold;
            }

            // console.log({
            //     // coeffsDirection,
            //     // top,
            //     bottom,
            //     hideTreshold,
            //     height,
            //     pHeight: this._height,
            //     coeff: coeffs.hide,
            // })
            if (getIsHide(top, bottom, hideTreshold)) {
                show = false;
            }
            this._updateSectionActivation(show, section);
        }
    }

    protected _updateSectionActivation(show: boolean, section: Section) {
        if (show != null) {
            if (show) {
                section.activate({ direction: this._scrollDirection });
                section.scroll(this._scrollPosition, this._scrollDirection);
            } else if (section.isActive) {
                section.deactivate({ direction: this._scrollDirection });
            }
        }
    }
}
