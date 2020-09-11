import Component , { ComponentConfig } from 'app/core/component';
import logger from 'app/logger';

import { HtmlTabItem, TabItemElement, HtmlTabItemConfig, TabItem } from './tabsComponent.tab';
import { HtmlTabLinkItem, TabLinkItem } from './tabsComponent.link';
import { OptAwait } from 'app/utils/async';

export type ChangCallback = (prev: TabLinkItem, next: TabLinkItem, direction: number) => void;

export interface TabsComponentConfig extends ComponentConfig {
    tabItems: TabItem[];
    tabs?: HTMLElement[];
    linkItems?: TabLinkItem[];
    links?: HTMLElement[];
    linkActiveClass?: string;
    tabActiveClass?: string;
    syncActivate: boolean;
    onChanged?: ChangCallback;
    onChanging?: ChangCallback;
    onWillChange?: ChangCallback;
    clicksEnabled?: boolean;
    hoversEnabled?: boolean;
}

const NoOp: ChangCallback = () => { };

export default class TabsComponent extends Component<TabsComponentConfig> {
    private _prevButton: HTMLElement;
    private _nextButton: HTMLElement;
    private syncActivate: boolean;
    private _tabs: TabItem[];
    private _links: TabLinkItem[];
    private _async: boolean;
    private _currentActiveLink: TabLinkItem;
    private _isSwitching: boolean;
    private _currentActiveIndex: number;

    constructor(config: TabsComponentConfig) {
        super(config);

        this.syncActivate = config.syncActivate;
        this._async = !this.syncActivate;

        this._tabs = config.tabItems
            || (config.tabs).map(t => new HtmlTabItem({
                el: t as TabItemElement,
                activateClass: config.tabActiveClass || 'active',
            }));

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
        this._currentActiveIndex = -1;
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

    private setActiveIndex = (index: number) => this.setActiveLink(this._links[index]);

    private setActiveLink = async (link: TabLinkItem) => {
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
            before: () => (this._config.onWillChange || NoOp)(prev, next, direction),
            inside: () => (this._config.onChanging || NoOp)(prev, next, direction),
            after: () => (this._config.onChanged || NoOp)(prev, next, direction),
        };

        this._currentActiveLink = next;
        this._currentActiveIndex = nextIndex;

        try {
            cbs.before();

            await OptAwait(() => prev?.deactivate(direction), !this._async);

            cbs.inside();

            await OptAwait(() => next.activate(direction), !this._async);

            cbs.after();
        } finally {
            this._isSwitching = false;
        }
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
