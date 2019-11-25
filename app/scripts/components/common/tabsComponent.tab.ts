
import Component, { ComponentConfig } from 'app/core/component';

export interface TabItemElement extends HTMLElement {
    linkHooks?: any;
    tabId?: string
    tabHooks?: {
        activate: (direction: number) => Promise<any>|void,
        deactivate: (andirection: number) => Promise<any>|void,
    }
    activateClass?: string;
    activate?(direction: number): void;
    deactivate?(direction: number): void;
}

export type TabItemConfig = ComponentConfig<TabItemElement> & {
};

export class TabItem<TConfig extends TabItemConfig = TabItemConfig> extends Component<TConfig> {

    get tabId() { return this.element.dataset.navId; }
    get item() { return this._config.el; }

    protected doSetup() {
        /* no-op */
    }

    protected _activate(direction: number) {
        return Promise.resolve(this._activateSelf(direction))
            .then(() => {
                if (this.item.tabHooks && this.item.tabHooks.activate) {
                    return this.item.tabHooks.activate(direction);
                }
                return Promise.resolve();
            });
    }

    protected _deactivate(direction: number) {
        return Promise.resolve(this._deactivateSelf(direction))
            .then(() => {
                if (this.item.tabHooks && this.item.tabHooks.deactivate) {
                    return this.item.tabHooks.deactivate(direction);
                }
                return Promise.resolve();
            });
    }

     _activateSelf(direction: number) {
        return Promise.resolve();
    }

     _deactivateSelf(direction: number) {
        return Promise.resolve();
    }
}
 export interface HtmlTabItemConfig extends TabItemConfig {
    activateClass?: string;
    clicksEnabled?: boolean;
    hoversEnabled?: boolean;

}

export class HtmlTabItem extends TabItem<HtmlTabItemConfig>  {
    private _activateClass?: string;

    constructor(config: HtmlTabItemConfig) {
        super(config);

        this._activateClass = config.activateClass;
    }

     _activateSelf(direction: number) {
        this.item.classList.add(this._activateClass);
        return Promise.resolve();
    }

     _deactivateSelf(direction: number) {
        this.item.classList.remove(this._activateClass);
        return Promise.resolve();
    }
}
