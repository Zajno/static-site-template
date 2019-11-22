
// libs
import { TweenMax, Power1 } from 'gsap';

import BodymovinIcon from 'app/components/common/bodymovin-icon';
import { AnimationConfigWithPath } from 'lottie-web';

export default class BodymovinVisual extends BodymovinIcon {
    _bodymovinParams: AnimationConfigWithPath;
    _isComplete: boolean;

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

    _activate(delay, direction) {
        console.log('activate')
        TweenMax.set(this._playBodymovin, { opacity: 1 });
       this._playBodymovin();
    }

    _deactivate(delay, direction) {
        TweenMax.to(this.element, 0.4, {  opacity: 0, delay: delay || 0, ease: Power1.easeInOut });
        this._stopBodymovin();
    }
}
