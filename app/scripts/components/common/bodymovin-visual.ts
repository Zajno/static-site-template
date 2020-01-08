
// libs
import TweenMax, { Power1 } from 'gsap';

import BodymovinIcon from 'app/components/common/bodymovin-icon';

export default class BodymovinVisual extends BodymovinIcon {
    _isComplete: boolean;

    async doSetup() {
        super.doSetup();

        this._bodymovinParams.loop = true;
        this._bodymovinParams.autoplay = false;
    }

    _stopBodymovin() {
        this._animBodymovin.goToAndStop(0);
        this._isComplete = false;
    }

    _activate(delay, direction) {
        TweenMax.set(this.element, { opacity: 1 });
        this._playBodymovin();
    }

    _deactivate(delay, direction) {
        TweenMax.to(this.element, 0.4, {  opacity: 0, delay: delay || 0, ease: Power1.easeInOut });
        this._stopBodymovin();
    }
}
