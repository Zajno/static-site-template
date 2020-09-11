
import Section from 'app/core/section';
 import TabsComponent from 'app/components/common/tabsComponent';
import { HtmlTabItem } from 'app/components/common/tabsComponent.tab';

export default class TabSection extends Section {
    _mainTabs: NodeListOf<HTMLElement>;
    private tabs: TabsComponent;

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
            const tabObj = new HtmlTabItem ({
                el: tab,
            });

            tabs.push(tabObj);
        });
        return tabs;
    }
}