import Component, { ComponentConfig } from 'app/core/component';

import { TabItemElementType } from './tabsComponent.tab';

/** @typedef {(import ('./tabsComponent.tab.js').TabItem)} TabItem */
/** @typedef {import ('./tabsComponent').DelayedOperation} DelayedOperation */

export class TabLinkItem<TabsComponentConfig> extends Component{
    protected doSetup(): void | Promise<void> {
        this._el;
        this._tabs = [];
    }
    _activateCallback: (link:any) => void
    _el: TabItemElementType;
    _tabs: TabItemElementType[];
    _chainActivation: any;
    _setup(config) {

    }

    get targetId():string { throw new Error('not implemented'); }

    get tabs() { return this._tabs; }

    get item() { return this._el; }

    setActivateCallback(cb:(link : any) => void) {
        this._activateCallback = cb;
        return this;
    }

    setActivationChain(enabled: boolean) {
        this._chainActivation = enabled;
        return this;
    }

    init() {
        return this;
    }

    _requestActivate() {
        if (this._activateCallback) {
            this._activateCallback(this);
        }
    }

    _activate(direction:number) {
        if (this._chainActivation) {
            let res = Promise.resolve(this._activateSelf(direction));
            this._tabs.forEach(t => {
                res = res.then(() => Promise.resolve(t.activate(direction)));
            });
            return res;
        }

        this._tabs.forEach(t => t.activate(direction));
        this._activateSelf(direction);
        return true;
    }

    _activateSelf(direction) {
        if (this._el.linkHooks && this._el.linkHooks.activate) {
            this._el.linkHooks.activate(direction);
        }
    }

    _deactivate(direction) {
        if (this._chainActivation) {
            let res = Promise.resolve(this._deactivateSelf(direction));
            this._tabs.forEach(t => {
                res = res.then(() => Promise.resolve(t.deactivate(direction)));
            });
            return res;
        }

        this._tabs.forEach(t => t.deactivate(direction));
        this._deactivateSelf(direction);
        return null;
    }

    _deactivateSelf(direction) {
        if (this._el.linkHooks && this._el.linkHooks.deactivate) {
            this._el.linkHooks.deactivate(direction);
        }
    }

    /** @param {TabItem} tab */
    registerTab(tab) {
        this._tabs.push(tab);
    }
}

export class HtmlTabLinkItem<TabsComponentConfig> extends TabLinkItem {
    _activeClass: any;
    _clickEnabled: any;
    _hoverEnabled: any;
    constructor(item: HTMLElement, activeClass = 'active', clickEnabled = true, hoverEnabled = false) {
        super({ el: item, activeClass, clickEnabled, hoverEnabled });
    }

    /** @param {{activeClass:string,clickEnabled:boolean, hoverEnabled:boolean}} config */
    _setup(config) {
        super._setup(config);

        const { activeClass, clickEnabled, hoverEnabled } = config;

        this._activeClass = activeClass;
        this._clickEnabled = clickEnabled;
        this._hoverEnabled = hoverEnabled;

        if (this._clickEnabled) {
            this._el.addEventListener('click', this._onClick.bind(this));
        }
        if (this._hoverEnabled) {
            this._el.addEventListener('mouseover', this._onHover.bind(this));
        }
    }

    init() {
        if (this._el.classList.contains(this._activeClass)) {
            this._activate(0);
        }
        return super.init();
    }

    get targetId() { return this._el.dataset.navTarget; }

    _onClick(e) {
        e.preventDefault();
        this._requestActivate();
    }

    _onHover(e) {
        e.preventDefault();
        this._requestActivate();
    }

    _activateSelf(direction) {
        this._el.classList.add(this._activeClass);
        super._activateSelf(direction);
    }

    _deactivateSelf(direction) {
        this._el.classList.remove(this._activeClass);
        super._deactivateSelf(direction);
    }
}
