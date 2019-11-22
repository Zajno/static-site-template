
import Section from 'app/core/section';

// components
import BodymovinVisual    from 'app/components/common/bodymovin-visual';

export default class HeroSection extends Section {
    _visual: BodymovinVisual;

    async setupSection() {

        this._visual = await new BodymovinVisual({ el: this.element.querySelector('.bodymovin__wrap'), register: true })
            .setup();
        console.log(this._visual, 'visual start setup');
    }

    resize(width) {

    }
    // STATE -------------------------------------------------------------------

    _activate() {
        console.log('active')
        this._visual.activate();
        console.log('active section')
    }

    _deactivate() {
        this._visual.deactivate(0, 30);
    }
}