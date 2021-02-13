import Component, { ComponentConfig, ActivateConfig } from 'app/core/component';

export interface TabItemElement extends HTMLElement {
    linkHooks?: {
        activate?: (config?: ActivateConfig) => void,
        deactivate?: (config?: ActivateConfig) => void,
    };
    tabId?: string
    tabHooks?: {
        activate: (config?: ActivateConfig) => Promise<void> | void,
        deactivate: (config?: ActivateConfig) => Promise<void> | void,
    }
    activateClass?: string;
    activate?(config?: ActivateConfig): void;
    deactivate?(config?: ActivateConfig): void;
}

export type TabItemConfig = ComponentConfig<TabItemElement> & {
};

export class TabItem<TConfig extends TabItemConfig = TabItemConfig> extends Component<TConfig> {

    get tabId() { return this.element.dataset.navId; }
    get item() { return this._config.el; }

    protected doSetup() {
        /* no-op */
    }

    protected async _activate() {
        await this._activateSelf();

        if (this.item.tabHooks?.activate) {
            await this.item.tabHooks.activate(this.activationConfig);
        }
    }

    protected async _deactivate() {
        await this._deactivateSelf();

        if (this.item.tabHooks?.deactivate) {
            await this.item.tabHooks.deactivate(this.activationConfig);
        }
    }

    protected _activateSelf(): void | Promise<void> {
        /* no-op */
    }

    protected _deactivateSelf(): void | Promise<void> {
        /* no-op */
    }
}
 export interface HtmlTabItemConfig extends TabItemConfig {
    activateClass?: string;
    clicksEnabled?: boolean;
    hoversEnabled?: boolean;
}

export class HtmlTabItem extends TabItem<HtmlTabItemConfig> {
    protected _activateSelf() {
        if (this._config.activateClass) {
            this.item.classList.add(this._config.activateClass);
        }
    }

    protected _deactivateSelf() {
        if (this._config.activateClass) {
            this.item.classList.remove(this._config.activateClass);
        }
    }
}
