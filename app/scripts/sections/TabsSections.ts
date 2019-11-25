
import Section from 'app/core/section';
 import TabsComponent, { TabsComponentConfig } from 'app/components/common/tabsComponent';
import { TabItemElement, TabItem, HtmlTabItemConfig, HtmlTabItem } from 'app/components/common/tabsComponent.tab';

export default class TabSection extends Section {
    _mainTabs: NodeListOf<HTMLElement>;
    tabs: TabsComponent;

    async setupSection() {
        this._mainTabs = this.element.querySelectorAll('.tab-item-wrap');
    }

    protected _activate() { /* no-op */}

    protected _deactivate() { /* no-op */}

    resize() {
        this.tabs = new TabsComponent({
            tabItems: this._createTabItems(),
            links: this.element.querySelectorAll('.tab-link') as unknown as HTMLElement[],
            linkActiveClass: 'active',
            syncActivate: true,
            el: this.element,
        });
    }
    _createTabItems() {
        const tabs: HtmlTabItem[] = [];
        this._mainTabs.forEach(tab  => {
            const tabObj = new TabItem ({
                el: tab,
            });

            tabs.push(tabObj);
        });
        return tabs;
    }
}