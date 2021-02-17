import Component, { ComponentConfig } from 'app/core/component';

import { TabItemElement, TabItem } from './tabsComponent.tab';
import { OptAwait } from '@zajno/common/lib/async/opts';

export type TabLinkItemConfig = ComponentConfig<TabItemElement> & {

};

export abstract class TabLinkItem<T extends TabLinkItemConfig = TabLinkItemConfig> extends Component<T> {
    private readonly _tabs: TabItem[] = [];
    private _activateCallback: (link: TabLinkItem) => void = null;
    private _chainActivation: boolean = false;

    get item(): TabItemElement { return this._config.el; }

    abstract get targetId(): string;

    get tabs() { return this._tabs; }

    public setActivateCallback(cb: (link: TabLinkItem) => void) {
        this._activateCallback = cb;
        return this;
    }

    public setActivationChain(enabled: boolean) {
        this._chainActivation = enabled;
        return this;
    }

    public registerTab(tab: TabItem) {
        this._tabs.push(tab);
    }

    protected _requestActivate() {
        if (this._activateCallback) {
            this._activateCallback(this);
        }
    }

    protected async _activate() {
        for (let i = 0; i < this._tabs.length; ++i) {
            const t = this._tabs[i];
            await OptAwait(() => t.activate(this.activationConfig), this._chainActivation);
        }

        this._activateSelf();

        if (this.item.linkHooks?.activate) {
            this.item.linkHooks.activate(this.activationConfig);
        }
    }

    protected abstract _activateSelf(): void;

    protected async _deactivate() {
        for (let i = 0; i < this._tabs.length; ++i) {
            const t = this._tabs[i];
            await OptAwait(() => t.deactivate(this.activationConfig), this._chainActivation);
        }

        this._deactivateSelf();

        if (this.item.linkHooks?.deactivate) {
            this.item.linkHooks.deactivate(this.activationConfig);
        }
    }

    protected abstract _deactivateSelf(): void;
}

export type HtmlTabLinkItemConfig = TabLinkItemConfig & {
        activeClass?: string,
        clickEnabled?: boolean,
        hoverEnabled?: boolean,
};

export class HtmlTabLinkItem<T extends HtmlTabLinkItemConfig = HtmlTabLinkItemConfig> extends TabLinkItem<T> {

    protected get activeClass() { return this._config.activeClass || 'active'; }
    protected get hoverEnabled() { return this._config.hoverEnabled || false; }
    protected get clickEnabled() { return this._config.clickEnabled == null ? true : !!this._config.clickEnabled; }

    get targetId() { return this.item.dataset.navTarget; }

    protected doSetup() {
        if (this.clickEnabled) {
            this.item.addEventListener('click', this._onClick.bind(this));
        }
        if (this.hoverEnabled) {
            this.item.addEventListener('mouseover', this._onHover.bind(this));
        }

        if (this.item.classList.contains(this.activeClass)) {
            this.activate();
        }
    }

    private _onClick(e: MouseEvent) {
        e.preventDefault();
        this._requestActivate();
    }

    private _onHover(e: MouseEvent) {
        e.preventDefault();
        this._requestActivate();
    }

    protected _activateSelf() {
        this.item.classList.add(this.activeClass);
    }

    protected _deactivateSelf() {
        this.item.classList.remove(this.activeClass);
    }
}
