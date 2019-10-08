
import Component from 'core/component';

/** @typedef {import ('core/component').ComponentConfig} ComponentConfig */
/** @typedef {import ('./tabsComponent').DelayedOperation} DelayedOperation */

export class TabItem extends Component {
    /** @param {ComponentConfig} config */
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);
        /** @type {HTMLElement & {tabHooks?:{activate:DelayedOperation,deactivate:DelayedOperation}}} */
        this._el;
    }

    get tabId() { return this._el.dataset.navId; }

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

    // eslint-disable-next-line class-methods-use-this
    _activateSelf(direction) {
        return Promise.resolve();
    }

    // eslint-disable-next-line class-methods-use-this
    _deactivateSelf(direction) {
        return Promise.resolve();
    }
}

export class HtmlTabItem extends TabItem {

    /** @param {ComponentConfig & {activateClass:string}} config */
    constructor(config) {
        super(config);

        this._activateClass = config.activateClass;
    }

    _activateSelf(direction) {
        this._el.classList.add(this._activateClass);
        return Promise.resolve();
    }

    _deactivateSelf(direction) {
        this._el.classList.remove(this._activateClass);
        return Promise.resolve();
    }
}
