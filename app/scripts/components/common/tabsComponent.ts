/* eslint-disable react/no-multi-comp */

import Component , { ComponentConfig } from 'app/core/component';
import logger from 'app/logger';

import { HtmlTabItem, TabItemElement, HtmlTabItemConfig } from './tabsComponent.tab';
import { HtmlTabLinkItem, TabLinkItem} from './tabsComponent.link';

export interface TabsComponentConfig extends ComponentConfig {
    tabItems: HtmlTabItem[];
    tabs?: HTMLElement[];
    linkItems?: HtmlTabLinkItem[];
    links?: HTMLElement[];
    linkActiveClass?: string;
    tabActiveClass?: string;
    syncActivate: boolean;
    onChanged?: (prev: any, next: any, direction: number) => void;
    onChanging?: (prev: any, next: any, direction: number) => void;
    onWillChange?: (prev: any, next: any, direction: number) => void;
    clicksEnabled?: boolean;
    hoversEnabled?: boolean;
}

export default class TabsComponent extends Component<TabsComponentConfig> {
    private _prevButton: HTMLElement;
    private _nextButton: HTMLElement;
    private syncActivate: boolean;
    private _tabs: HtmlTabItem[];
    private _links: HtmlTabLinkItem[];
    private _onLinkWillChange: (prev: any, next: any, direction: number) => void;
    private _onLinkChanged: (prev: any, next: any, direction: number) => void;
    private _async: boolean;
    private _clicksEnabled: boolean;
    private _hoversEnabled: boolean;
    private _linkActiveClass: string;
    private _tabActiveClass: string;
    private _currentActiveLink: any;
    private _isSwitching: boolean;
    private _currentActiveIndex: number;

    _onLinkChanging(prev: any, next: any, direction: number) {
        throw new Error('Method not implemented.');
    }

    constructor(config: TabsComponentConfig) {
        super(config);

        this._linkActiveClass = config.linkActiveClass || 'active';
        this._tabActiveClass = config.tabActiveClass || 'active';

        this._onLinkWillChange = config.onWillChange || (() => {/* no-op */});
        this._onLinkChanged = config.onChanged || (() => {/* no-op */});
        this._onLinkChanged = config.onChanging || (() => {/* no-op */});
        this.syncActivate = config.syncActivate;
        this._async = !this.syncActivate;

        this._clicksEnabled = config.clicksEnabled;
        this._hoversEnabled = config.hoversEnabled;

        this._tabs = config.tabItems
            || (config.tabs).map(t => new HtmlTabItem({ el: t as TabItemElement, activateClass: this._tabActiveClass }));

        this._links = config.linkItems
            || (config.links || []).map(l => {
                const configHtml: HtmlTabItemConfig  =  {
                    el: l as TabItemElement,
                    activateClass: config.linkActiveClass,
                    clicksEnabled: config.clicksEnabled,
                    hoversEnabled: config.hoversEnabled,

                };
                 return new HtmlTabLinkItem(configHtml);
            });

        this._currentActiveLink = null;
        this._currentActiveLink = -1;
        this._isSwitching = false;
    }

    protected doSetup() {
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
                .setActivationChain(this.syncActivate)
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

    private setActiveIndex = (index) => this.setActiveLink(this._links[index]);

    private setActiveLink = (link) => {
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

    protected next(loop = true) {
        let nextIndex = this._currentActiveIndex + 1;

        if (nextIndex >= this._links.length) {
            nextIndex = loop ? 0 : this._links.length - 1;
        }
        this.setActiveIndex(nextIndex);
    }

    protected prev(loop = true) {
        let nextIndex = this._currentActiveIndex - 1;

        if (nextIndex < 0) {
            nextIndex = loop ? this._links.length - 1 : 0;
        }
        this.setActiveIndex(nextIndex);
    }

    protected addNextButton(btn: HTMLElement, loop = true) {
        this._nextButton = btn;
        if (this._nextButton) {
            this._nextButton.addEventListener('click', e => {
                e.preventDefault();
                this.next(loop);
            });
        }
        return this;
    }

    protected addPrevButton(btn: HTMLElement, loop = true) {
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
