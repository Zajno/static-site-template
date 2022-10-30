import logger from 'app/logger';

export interface ComponentConfig<T extends HTMLElement = HTMLElement> {
    el: T;
    logActivation?: boolean;
}

export type ActivateConfig = {
    delay?: number,
    direction?: 1 | 0 | -1,
};

export default abstract class Component<TConfig extends ComponentConfig = ComponentConfig> {

    private _active = false;
    private _wasActive = false;
    protected readonly _config: TConfig;

    private _activateConfig: ActivateConfig = null;

    constructor(config: TConfig) {
        this._config = config;
    }

    get element() { return this._config.el; }
    get isActive() { return this._active; }

    protected get activationConfig() { return this._activateConfig; }
    protected get wasActive() { return this._wasActive; }

    public async setup() {
        await this.doSetup();
        return this;
    }

    protected abstract doSetup(): Promise<void> | void;

    activate(config?: ActivateConfig) {
        this._activateConfig = null;
        if (this._active) {
            return true;
        }

        this._active = true;
        if (this.logActivation) {
            logger.log('Activating:', this);
        }

        this._activateConfig = config;
        return this._activate();
    }

    deactivate(config?: ActivateConfig) {
        this._activateConfig = null;
        if (!this._active) {
            return true;
        }

        this._wasActive = true;
        this._active = false;
        if (this.logActivation) {
            logger.log('Deactivating:', this);
        }

        this._activateConfig = config;
        return this._deactivate();
    }

    protected _activate(): void | Promise<void> {
        // override me
    }

    protected _deactivate(): void| Promise<void> {
        // override me
    }

    get rect() { return this.element ? this.element.getBoundingClientRect() : new window.DOMRect(); }

    get isOnScreen() {
        const r = this.rect;
        if (r.bottom < 0) {
            return false;
        }

        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return r.top - viewHeight < 0;
    }

    protected get logActivation() { return this._config.logActivation; }

    protected useDefaultConfig(defaults: Partial<TConfig>) {
        Object.assign(this._config, Object.assign(defaults, this._config));
    }
}
