import Component, { ComponentConfig } from 'app/core/component';

import { TabItemElement, TabItem } from './tabsComponent.tab';

/** @typedef {(import ('./tabsComponent.tab.js').TabItem)} TabItem */
/** @typedef {import ('./tabsComponent').DelayedOperation} DelayedOperation */

export type TabLinkItemConfig = ComponentConfig<TabItemElement> & {

};

export abstract class TabLinkItem<T extends TabLinkItemConfig = TabLinkItemConfig> extends Component<T> {
    private readonly _tabs: TabItem[] = [];
    private _activateCallback: (link: TabLinkItem) => void = null;
    private _chainActivation: boolean = false;

    get item(): TabItemElement { return this._config.el; }

    protected doSetup() {
        /* no-op */
    }

    abstract get targetId(): string;

    get tabs() { return this._tabs; }

    setActivateCallback(cb: (link: TabLinkItem) => void) {
        this._activateCallback = cb;
        return this;
    }

    setActivationChain(enabled: boolean) {
        this._chainActivation = enabled;
        return this;
    }

    protected init() {
        return this;
    }

    _requestActivate() {
        if (this._activateCallback) {
            this._activateCallback(this);
        }
    }

    activate(direction?: number) {
        if (this._chainActivation) {
            let res = Promise.resolve(this._activateSelf(direction));
            this._tabs.forEach(t => {
                res = res.then(() => Promise.resolve(t.activate(direction))) as Promise<void>;
            });
            return res;
        }

        this._tabs.forEach(t => t.activate(direction));
        this._activateSelf(direction);
        return true;
    }

     _activateSelf(direction?: number) {
        if (this.item.linkHooks && this.item.linkHooks.activate) {
            this.item.linkHooks.activate(direction);
        }
    }

    _deactivate(direction?: number) {
        if (this._chainActivation) {
            let res = Promise.resolve(this._deactivateSelf(direction));
            this._tabs.forEach(t => {
                res = res.then(() => Promise.resolve(t.deactivate(direction))) as Promise<void>;
            });
            return res;
        }

        this._tabs.forEach(t => t.deactivate(direction));
        this._deactivateSelf(direction);
        return null;
    }

    _deactivateSelf(direction) {
        if (this.item.linkHooks && this.item.linkHooks.deactivate) {
            this.item.linkHooks.deactivate(direction);
        }
    }

    registerTab(tab: TabItem) {
        this._tabs.push(tab);
    }
}

export type HtmlTabLinkItemConfig = TabLinkItemConfig & {
        activeClass?: string,
        clickEnabled?: boolean,
        hoverEnabled?: boolean,
};

export class HtmlTabLinkItem<T extends HtmlTabLinkItemConfig = HtmlTabLinkItemConfig> extends TabLinkItem<T> {
    private _activeClass: string;
    private _clickEnabled: boolean;
    private _hoverEnabled: boolean;

    protected doSetup() {
        super.doSetup();

        const { activeClass, clickEnabled, hoverEnabled } = this._config;

        this._activeClass = activeClass || 'active';
        this._clickEnabled = clickEnabled == null ? true : !!clickEnabled;
        this._hoverEnabled = hoverEnabled || false;

        if (this._clickEnabled) {
            this.item.addEventListener('click', this._onClick.bind(this));
        }
        if (this._hoverEnabled) {
            this.item.addEventListener('mouseover', this._onHover.bind(this));
        }
    }
     init() {
        if (this.item.classList.contains(this._activeClass)) {
            this._activate(0);
        }
        return super.init();
    }

    get targetId() { return this.item.dataset.navTarget; }

    _onClick(e) {
        e.preventDefault();
        this._requestActivate();
    }

    _onHover(e) {
        e.preventDefault();
        this._requestActivate();
    }

    _activateSelf(direction) {
        this.item.classList.add(this._activeClass);
        super._activateSelf(direction);
    }

    _deactivateSelf(direction) {
        this.item.classList.remove(this._activeClass);
        super._deactivateSelf(direction);
    }
}
