
// libs
import { TweenMax, Power1 } from 'gsap';

import Breakpoints from  'app/appBreakpoints';
import BodymovinIcon from 'app/components/common/bodymovin-icon';
import { AnimationConfigWithPath } from 'lottie-web';

export default class BodymovinVisual extends BodymovinIcon {
    _bodymovinParams: AnimationConfigWithPath;
    _isComplete: boolean;
    // SETUP -------------------------------------------------------------------

    async doSetup() {

        super.doSetup();

        this._bodymovinParams = {
            container: this.element,
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: this.element.dataset.bodymovinPath,
        };
        TweenMax.set(this.element, { opacity: 0 });
    }

    _stopBodymovin() {
        this._animBodymovin.goToAndStop(0);
        this._isComplete = false;
    }

    // STATE -------------------------------------------------------------------

    _activate(delay, direction) {
        setTimeout(this._playBodymovin, 500);
    }

    _deactivate(delay, direction) {
        TweenMax.to(this.element, 0.4, {  opacity: 0, delay: delay || 0, ease: Power1.easeInOut });
        this._stopBodymovin();
    }
}
