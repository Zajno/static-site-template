import 'app/utils/checkBrowserSupport';

import logger from 'app/logger';
import Section, { SectionCtor, SectionConfig, Directions, SectionActions } from './section';

export interface IPage {
    readonly width: number;
    readonly height: number;

    readonly scrollPosition: number;
    readonly scrollDirection: number;
}

type ScrollDirectionHelpers = {
    [k1 in Directions]: {
        [k2 in SectionActions]: (top: number, bottom: number, showTreshold: number) => boolean;
    };
};

export interface PageCtor {
    new(): Page;
}

export default abstract class Page implements IPage {
    private _root: HTMLElement = null;
    private _sections: Section[];

    private _width: number;
    private _height: number;

    private _centerY: number = 0.0;

    private _scrollPosition: number = 0.0;
    private _scrollDirection: number = -1.0;

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

    static async RunPage(PageType: PageCtor) {
        const page = new PageType();
        try {
            await page.setupAsync();
            page.start();
        } catch (err) {
            console.error(`failed to setup page '${PageType.name}':`, err);
        }
    }

    protected abstract get sectionTypes(): SectionCtor[];
    protected get root() { return this._root; }

    get width() { return this.width; }
    get height() { return this._height; }

    get scrollPosition() { return this._scrollPosition; }
    get scrollDirection() { return this._scrollDirection; }

    get centerY() { return this._centerY; }

    public async setupAsync() {
        this._root = document.getElementById('main')
            || document.getElementsByTagName('body')[0];

        window.onresize = this.resize;
        window.onscroll = this.scroll;

        await this._setupSections(this._root.querySelectorAll('section'));
        await this.setupPage();
    }

    protected async setupPage() {
        /* override me if you want */
    }

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

    scroll = () => {
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

    resize = () => {
        this._width = document.body.clientWidth;
        this._height = window.innerHeight;
        this._centerY = this._height * 0.5;

        for (let i = 0; i < this._sections.length; ++i) {
            this._sections[i].resize(this._width, this._height);
        }

        this.scroll();
    }

    _updateSections() {
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
            if (height < showTreshold)
                showTreshold = height * 0.5;

            // show if top of next element is in range
            if (getIsShow(top, bottom, showTreshold)) {
                show = true;
            }

            let hideTreshold = this._height * coeffs.hide;
            if (height < hideTreshold) {
                hideTreshold = height * 0.5;
            }

            if (getIsHide(top, bottom, hideTreshold)) {
                show = false;
            }

            this._updateSectionActivation(show, section);
        }
    }

    _updateSectionActivation(show: boolean, section: Section) {
        if (show != null) {
            if (show) {
                section.activate(0.0, this._scrollDirection);
                section.scroll(this._scrollPosition, this._scrollDirection);
            } else if (section.isActive) {
                section.deactivate(0.0, this._scrollDirection);
            }
        }
    }
}
