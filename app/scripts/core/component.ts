import logger from 'app/logger';

export interface ComponentConfig<T extends HTMLElement = HTMLElement> {
    el: T;
    logActivation?: boolean;
}

export default abstract class Component<TConfig extends ComponentConfig = ComponentConfig> {

    private _active = false;
    protected readonly _config: TConfig;

    constructor(config: TConfig) {
        this._config = config;
    }

    get element() { return this._config.el; }
    get isActive() { return this._active; }

    public async setup() {
        await this.doSetup();
        return this;
    }

    protected abstract doSetup(): Promise<void> | void;

    activate(delay = 0.0, direction = 1.0) {
        if (this._active) {
            return true;
        }

        this._active = true;
        if (this.logActivation) {
            logger.log('Activating:', this);
        }

        return this._activate(delay, direction);
    }

    deactivate(delay = 0.0, direction = 1.0) {
        if (!this._active)
            return true;

        this._active = false;
        if (this.logActivation) {
            logger.log('Deactivating:', this);
        }

        return this._deactivate(delay, direction);
    }

    protected _activate(delay?: number, direction?: number): void | Promise<void> {
        // override me
    }

    protected _deactivate(delay?: number, direction?: number): void| Promise<void> {
        // override me
    }

    get rect() { return this.element ? this.element.getBoundingClientRect() : new ClientRect(); }

    get isOnScreen() {
        const r = this.rect;
        if (r.bottom < 0) {
            return false;
        }

        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        return r.top - viewHeight < 0;
    }

    protected get logActivation() { return this._config.logActivation; }
}
