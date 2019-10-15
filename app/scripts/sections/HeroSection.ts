
import Section from 'app/core/section';

// components
import BodymovinVisual    from 'app/components/common/bodymovin-visual';

export default class HeroSection extends Section {
    _visual: BodymovinVisual;

    setupSection() {

        this._visual = new BodymovinVisual({ el: this.element.querySelector('.bodymovin__wrap'), register: true });
        console.log(this._visual, 'visual start setup');
        this._visual.activate();
    }

    resize(width) {

    }
    // STATE -------------------------------------------------------------------

    _activate(delay, direction) {
        this._visual.activate(delay, 30);

    }

    _deactivate(delay, direction) {
        this._visual.deactivate(delay, 30);
    }
}