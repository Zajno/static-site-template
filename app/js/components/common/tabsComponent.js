/* eslint-disable react/no-multi-comp */

import Component from 'core/component';
import logger from 'logger';

import { TabItem, HtmlTabItem } from './tabsComponent.tab';
import { HtmlTabLinkItem, TabLinkItem } from './tabsComponent.link';

/** @callback DelayedOperation
 * @param {number} direction
 * @returns {Promise|void}
 */

/** @typedef {Object} TabsComponentConfig
 * @property {HTMLElement} el
 * @property {TabItem[]} tabItems
 * @property {HTMLElement[]=} tabs
 * @property {TabLinkItem[]} linkItems
 * @property {HTMLElement[]=} links
 * @property {string=} linkActiveClass
 * @property {string=} tabActiveClass
 * @property {(prev:TabLinkItem,next:TabLinkItem,direction:number) => void} onChanged
 * @property {(prev:TabLinkItem,next:TabLinkItem,direction:Number) => void} onChanging
 * @property {(prev:TabLinkItem,next:TabLinkItem,direction:Number) => void} onWillChange
 * @property {boolean=} syncActivate
 * @property {boolean=} clicksEnabled
 * @property {boolean=} hoversEnabled
 */

export default class TabsComponent extends Component {
    /** @param {TabsComponentConfig} config */
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);
    }

    /** @param {TabsComponentConfig} config */
    _setup(config) {
        logger.log(config, '__config')
        /** @type {string} */
        this._linkActiveClass = config.linkActiveClass || 'active';
        this._tabActiveClass = config.tabActiveClass || 'active';

        /** @type {TabItem[]} */
        this._tabs = config.tabItems
            || (config.tabs || []).map(t => new HtmlTabItem({ el: t, activateClass: this._tabActiveClass }));

        /** @type {TabLinkItem[]} */
        this._links = config.linkItems
            || (config.links || []).map(l => new HtmlTabLinkItem(l, config.linkActiveClass, config.clicksEnabled, config.hoversEnabled));

        /** @type {TabLinkItem} */
        this._currentActiveLink = null;
        this._currentActiveIndex = -1;
        this._isSwitching = false;

        this._onLinkWillChange = config.onWillChange || (() => {});
        this._onLinkChanged = config.onChanged || (() => {});
        this._onLinkChanging = config.onChanging || (() => {});
        this._async = !config.syncActivate;

        this._clicksEnabled = config.clicksEnabled;
        this._hoversEnabled = config.hoversEnabled;

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
        const prevIndex = this._links.indexOf(prev);

        const direction = Math.sign(nextIndex - prevIndex);

        const cbs = {
            before: () => this._onLinkWillChange(prev, next, direction),
            inside: () => this._onLinkChanging(prev, next, direction),
            after: () => this._onLinkChanged(prev, next, direction),
        };

        this._currentActiveLink = next;
        this._currentActiveIndex = nextIndex;

        if (this._async) {
            cbs.before();
            if (prev) {
                prev.deactivate(direction);
            }
            cbs.inside();
            next.activate(direction);
            cbs.after();
            this._isSwitching = false;
            return null;
        }

        return new Promise((resolve, reject) => {
            if (prev) {
                cbs.before();
                return Promise.resolve(prev.deactivate(direction))
                    .then(cbs.inside)
                    .then(() => next.activate(direction))
                    .then(() => {
                        this._isSwitching = false;
                        cbs.after();
                    })
                    .then(resolve)
                    .catch(reject);
            }

            cbs.before();
            cbs.inside();
            return Promise.resolve(next.activate(direction))
                .then(() => {
                    cbs.after();
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
