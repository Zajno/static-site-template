/* eslint-disable react/no-multi-comp */

import Component from 'core/component';
import logger from 'logger';

/** @callback DelayedOperation
 * @returns {Promise|void}
 */

/** @typedef {Object} TabItem
 * @property {string} tabId
 * @property {DelayedOperation} activate
 * @property {DelayedOperation} deactivate
 */

/** @param {HTMLElement} item
 * @returns {TabItem} */
function createHtmlTabItem(item, activateClass) {
    return {
        _original: item,
        get tabId() { return this._original.dataset.navId; },
        activate() {
            this._original.classList.add(activateClass);
            if (this._original.tabHooks && this._original.tabHooks.activate) {
                this._original.tabHooks.activate();
            }
        },
        deactivate() {
            this._original.classList.remove(activateClass);
            if (this._original.tabHooks && this._original.tabHooks.deactivate) {
                this._original.tabHooks.deactivate();
            }
        },
    };
}

export class TabLinkItem extends Component {
    _setup(config) {
        super._setup(config);

        /** @type {TabItem[]} */
        this._tabs = [];
    }

    /** @returns {string} */
    get targetId() { throw new Error('not implemented'); }

    get tabs() { return this._tabs; }

    get item() { return this._el; }

    /** @param {(link:TabLinkItem) => void} cb */
    setActivateCallback(cb) {
        this._activateCallback = cb;
        return this;
    }

    setActivationChain(enabled) {
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

    _activate() {
        if (this._chainActivation) {
            let res = Promise.resolve(this._activateSelf());
            this._tabs.forEach(t => {
                res = res.then(() => Promise.resolve(t.activate()));
            });
            return res;
        }

        this._tabs.forEach(t => t.activate());
        this._activateSelf();
        return true;
    }

    _activateSelf() {
        if (this._el.linkHooks && this._el.linkHooks.onActivate) {
            this._el.linkHooks.onActivate(this);
        }
    }

    _deactivate() {
        if (this._chainActivation) {
            let res = Promise.resolve(this._deactivateSelf());
            this._tabs.forEach(t => {
                res = res.then(() => Promise.resolve(t.deactivate()));
            });
            return res;
        }

        this._tabs.forEach(t => t.deactivate());
        this._deactivateSelf();
        return null;
    }

    _deactivateSelf() {
        if (this._el.linkHooks && this._el.linkHooks.onDeactivate) {
            this._el.linkHooks.onDeactivate(this);
        }
    }

    /** @param {TabItem} tab */
    registerTab(tab) {
        this._tabs.push(tab);
    }
}

export class HtmlTabLinkItem extends TabLinkItem {
    /** @param {HTMLElement} item */
    constructor(item, activeClass = 'active', clickEnabled = true) {
        super({ el: item, activeClass, clickEnabled });
    }

    /** @param {{activeClass:string,clickEnabled:boolean}} config */
    _setup(config) {
        super._setup(config);

        const { activeClass, clickEnabled } = config;

        this._activeClass = activeClass;
        this._clickEnabled = clickEnabled;

        this._el.addEventListener('click', this._onClick.bind(this));
    }

    init() {
        if (this._el.classList.contains(this._activeClass)) {
            this.activate();
        }
        return super.init();
    }

    get targetId() { return this._el.dataset.navTarget; }

    _onClick(e) {
        e.preventDefault();
        if (this._clickEnabled) {
            this._requestActivate();
        }
    }

    _activateSelf() {
        this._el.classList.add(this._activeClass);
        super._activateSelf();
    }

    _deactivateSelf() {
        this._el.classList.remove(this._activeClass);
        super._deactivateSelf();
    }
}

/** @typedef {Object} TabsComponentConfig
 * @property {TabItem[]} tabItems
 * @property {HTMLElement[]=} tabs
 * @property {TabLinkItem[]} linkItems
 * @property {HTMLElement[]=} links
 * @property {string=} linkActiveClass
 * @property {string=} tabActiveClass
 * @property {(prev:TabLinkItem,next:TabLinkItem) => void} onChanged
 * @property {(prev:TabLinkItem,next:TabLinkItem) => void} onChanging
 * @property {boolean=} syncActivate
 * @property {boolean=} clicksEnabled
 */

export default class TabsComponent extends Component {
    /** @param {TabsComponentConfig} config */
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);
    }

    /** @param {TabsComponentConfig} config */
    _setup(config) {
        /** @type {string} */
        this._linkActiveClass = config.linkActiveClass || 'active';
        this._tabActiveClass = config.tabActiveClass || 'active';

        /** @type {TabItem[]} */
        this._tabs = config.tabItems
            || (config.tabs || []).map(t => createHtmlTabItem(t, this._tabActiveClass));

        /** @type {TabLinkItem[]} */
        this._links = config.linkItems
            || (config.links || []).map(l => new HtmlTabLinkItem(l, config.linkActiveClass, config.clicksEnabled));

        /** @type {TabLinkItem} */
        this._currentActiveLink = null;
        this._currentActiveIndex = -1;
        this._isSwitching = false;

        this._onLinkChanged = config.onChanged || (() => {});
        this._onLinkChanging = config.onChanging || (() => {});
        this._async = !config.syncActivate;

        this._clicksEnabled = config.clicksEnabled;

        this._links.forEach((link, index) => {
            const targetID = link.targetId;
            this._tabs.forEach(tab => {
                if (targetID === tab.tabId) {
                    link.registerTab(tab);
                }
            });

            if (link.tabs.length === 0) {
                logger.error('Could not find  tab for targetID =', targetID);
            }

            link
                .setActivateCallback(l => this.setActiveLink(l))
                .setActivationChain(config.syncActivate)
                .init();

            if (link.isActive) {
                if (this._currentActiveLink) {
                    link.deactivate();
                } else {
                    this._currentActiveLink = link;
                    this._currentActiveIndex = index;
                }
            }
        });
    }

    get currentIndex() { return this._currentActiveIndex; }

    get currentLink() { return this._currentActiveLink; }

    setActiveIndex = (index) => this.setActiveLink(this._links[index]);

    /** @param {TabLinkItem} link */
    setActiveLink = (link) => {
        if (link === this._currentActiveLink || this._isSwitching) {
            return null;
        }

        this._isSwitching = true;

        const prev = this._currentActiveLink;
        const next = link;
        const nextIndex = this._links.indexOf(link);

        this._currentActiveLink = next;
        this._currentActiveIndex = nextIndex;

        if (this._async) {
            if (prev) {
                prev.deactivate();
            }
            this._onLinkChanging(prev, next);
            next.activate();
            this._onLinkChanged(prev, next);
            this._isSwitching = false;
            return null;
        }

        return new Promise((resolve, reject) => {
            if (prev) {
                return Promise.resolve(prev.deactivate())
                    .then(() => this._onLinkChanging(prev, next))
                    .then(() => next.activate())
                    .then(() => {
                        this._isSwitching = false;
                        this._onLinkChanged(prev, next);
                    })
                    .then(resolve)
                    .catch(reject);
            }

            this._onLinkChanging(prev, next);
            return Promise.resolve(next.activate())
                .then(() => {
                    this._onLinkChanged(prev, next);
                    this._isSwitching = false;
                });
        });
    }

    next(loop = true) {
        let nextIndex = this._currentActiveIndex + 1;
        if (nextIndex >= this._links.length) {
            nextIndex = loop ? 0 : this._links.length - 1;
        }
        this.setActiveIndex(nextIndex);
    }

    prev(loop = true) {
        let nextIndex = this._currentActiveIndex - 1;
        if (nextIndex < 0) {
            nextIndex = loop ? this._links.length - 1 : 0;
        }
        this.setActiveIndex(nextIndex);
    }

    /** @param {HTMLElement} btn */
    addNextButton(btn, loop = true) {
        this._nextButton = btn;
        if (this._nextButton) {
            this._nextButton.addEventListener('click', e => {
                e.preventDefault();
                this.next(loop);
            });
        }
        return this;
    }

    /** @param {HTMLElement} btn */
    addPrevButton(btn, loop = true) {
        this._prevButton = btn;
        if (this._prevButton) {
            this._prevButton.addEventListener('click', e => {
                e.preventDefault();
                this.prev(loop);
            });
        }
        return this;
    }
}
