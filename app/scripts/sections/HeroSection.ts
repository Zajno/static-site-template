
import Section from 'app/core/section';

// components
import BodymovinVisual from 'app/components/common/bodymovin-visual';

export default class HeroSection extends Section {
    _visual: BodymovinVisual;

    async setupSection() {

        this._visual = await new BodymovinVisual({ el: this.element.querySelector('.bodymovin__wrap'), register: true })
            .setup();
    }

    protected _activate() {
        this._visual.activate();
    }

    protected _deactivate() {
        this._visual.deactivate(0, 30);
    }
}