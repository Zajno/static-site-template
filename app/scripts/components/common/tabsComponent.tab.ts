import Component, { ComponentConfig } from 'app/core/component';

export interface TabItemElement extends HTMLElement {
    linkHooks?: {
        activate?: (direction?: number) => void,
        deactivate?: (direction?: number) => void,
    };
    tabId?: string
    tabHooks?: {
        activate: (direction: number) => Promise<void> | void,
        deactivate: (direction: number) => Promise<void> | void,
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

    protected async _activate(direction: number) {
        await this._activateSelf(direction);

        if (this.item.tabHooks?.activate) {
            await this.item.tabHooks.activate(direction);
        }
    }

    protected async _deactivate(direction: number) {
        await this._deactivateSelf(direction);

        if (this.item.tabHooks?.deactivate) {
            await this.item.tabHooks.deactivate(direction);
        }
    }

    protected _activateSelf(direction: number): void | Promise<void> {
        /* no-op */
    }

    protected _deactivateSelf(direction: number): void | Promise<void> {
        /* no-op */
    }
}
 export interface HtmlTabItemConfig extends TabItemConfig {
    activateClass?: string;
    clicksEnabled?: boolean;
    hoversEnabled?: boolean;
}

export class HtmlTabItem extends TabItem<HtmlTabItemConfig>  {
    protected _activateSelf(direction: number) {
        if (this._config.activateClass) {
            this.item.classList.add(this._config.activateClass);
        }
    }

    protected _deactivateSelf(direction: number) {
        if (this._config.activateClass) {
            this.item.classList.remove(this._config.activateClass);
        }
    }
}
