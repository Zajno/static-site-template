import Component, { ComponentConfig } from './component';
import { IPage } from './page';

export type Directions = 'up' | 'down';
export type SectionActions = 'show' | 'hide';

export type ActivationCoeffs = {
    show: number,
    hide: number,
};

// type A = { a: string, b: number };
// type Aa = keyof A;

// const t: Partial<A>;

export type ActivationDirectCoeffs = {
    [k1 in Directions]: {
        [k2 in SectionActions]: number;
    };
};

export interface SectionConfig extends ComponentConfig {
    page: IPage;
}

export interface SectionCtor<TConfig extends SectionConfig = SectionConfig> {
    new(config: TConfig): Section<TConfig>;
}

export default class Section<TConfig extends SectionConfig = SectionConfig>
    extends Component<TConfig> {
    protected _scrollCoeffs: ActivationDirectCoeffs = {
        down: {
            show: 0.3,
            hide: 0.5,
        },
        up: {
            show: 0.3,
            hide: 0.3,
        },
    };

    private _scrollPosition = 0;

    get page() { return this._config.page; }
    get scrollCoeffs(): Readonly<ActivationDirectCoeffs> { return this._scrollCoeffs; }
    get scrollPosition() { return this._scrollPosition; }

    protected async doSetup() {
        if (this.element && this.element.style) {
            this.element.style.visibility = 'visible';
        }

        await this.setupSection();
    }

    protected setupSection(): Promise<void> | void {
        /* override me if you want */
    }

    public resize(width: number, height: number) {
        /* override me if you want */
    }

    public scroll(scrollPosition: number, scrollDirection: number) {
        const rect = this.rect;
        const totalHeight = this.page.height + rect.height;
        const yPos = totalHeight - rect.bottom;
        this._scrollPosition = yPos / totalHeight;
        // console.log(this,'___scrol section')
        /* override me if you want */
    }

    public wheel(deltaY: number, wheelDirection: number) {
        /* override me if you want */
    }

    get animateOnSetup() { return true; }

    get logAnimation() { return true; }
}
