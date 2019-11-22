
import Component, { ComponentConfig } from 'app/core/component';

export interface tabConfig{

}

export interface TabItemElementType extends HTMLElement {
    linkHooks: any;
    tabHooks?: {
        activate: (direction: number) => Promise<any>|void,
        deactivate: (andirection: number) => Promise<any>|void,
    }
    activate(direction: number): void;
    deactivate(direction: number): void;
}

export class TabItem<Tconfig> extends Component<ComponentConfig> {

    get tabId() { return this._el.dataset.navId; }
    _el: TabItemElementType;

    // tslint:disable-next-line: no-empty
    protected doSetup(): void | Promise<void> {
    }

    constructor(config: ComponentConfig) {
        super(config);
    }

    _activate(direction) {
        return Promise.resolve(this._activateSelf(direction))
            .then(() => {
                if (this._el.tabHooks && this._el.tabHooks.activate) {
                    return this._el.tabHooks.activate(direction);
                }
                return Promise.resolve();
            });
    }

    _deactivate(direction) {
        return Promise.resolve(this._deactivateSelf(direction))
            .then(() => {
                if (this._el.tabHooks && this._el.tabHooks.deactivate) {
                    return this._el.tabHooks.deactivate(direction);
                }
                return Promise.resolve();
            });
    }

    _activateSelf(direction) {
        return Promise.resolve();
    }

    _deactivateSelf(direction) {
        return Promise.resolve();
    }
}
 export interface HtmlTabItemConfig extends ComponentConfig {
    activateClass: string;
}

export class HtmlTabItem<HtmlTabItemConfig> extends TabItem<TConfig extends HtmlTabItemConfig = HtmlTabItemConfig>  {
    _activateClass: string;

    constructor(config: HtmlTabItemConfig) {
        super(config);

        this._activateClass = config.activateClass;
    }

    _activateSelf() {
        this._el.classList.add(this._activateClass);
        return Promise.resolve();
    }

    _deactivateSelf() {
        this._el.classList.remove(this._activateClass);
        return Promise.resolve();
    }
}
