
import Section from 'app/core/section';
 import TabsComponent, { TabsComponentConfig } from 'app/components/common/tabsComponent';
import { TabItemElementType, TabItem, HtmlTabItemConfig } from 'app/components/common/tabsComponent.tab';

export default class TabSection extends Section {
    _mainTabs: any;
    tabs: any;
    async setupSection() {
        this._mainTabs = this.element.querySelectorAll('.tab-item-wrap');
    }

    protected _activate() {
    }

    protected _deactivate() {
    }

    resize(){
        this.tabs = new TabsComponent({
            tabItems: this._createTabItems(),
            links: this.element.querySelectorAll('.tab-link'),
            linkActiveClass: 'active',
            syncActivate: true,
        });
    }
    _createTabItems() {
        const tabs:TabItemElementType[] = [];
        this._mainTabs.forEach(tab => {
            const tabObj:TabItemElementType = new TabItem<TabsComponentConfig> ({
                el: tab,
            });

            tabs.push(tabObj);
        });
        return tabs;
    }
}