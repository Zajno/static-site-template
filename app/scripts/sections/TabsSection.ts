
import Section from 'app/core/section';
import { TabsComponent } from 'app/components/common/tabs';

export default class TabSection extends Section {
    private tabs: TabsComponent;

    async setupSection() {
        this.tabs = new TabsComponent({
            el: this.element,
            tabs: this.element.querySelectorAll('.tab-item'),
            links: this.element.querySelectorAll('.tab-link'),
            linkActiveClass: 'active',
            syncActivate: true,
            clicksEnabled: true,
        });

        await this.tabs.setup();
    }

    protected _activate() {
        this.tabs.activate();
    }

    protected _deactivate() {
        this.tabs.deactivate();
    }
}
