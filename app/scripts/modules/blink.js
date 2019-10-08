export default ({ el, delay = 0.0, count, interval, on, off, final, onComplete }) => {
    let toggle = false;

    if (el.clearBlink)
        el.clearBlink();

    el.blinkDelay = setTimeout(() => {

        let currentCount = 0;

        el.blink = setInterval(() => {

            if (currentCount++ === count) {

                el.style.opacity = final;
                clearInterval(el.blink);

                if (onComplete) {
                    onComplete();
                }
            } else {

                el.style.opacity = (toggle) ? on : off;
                toggle = !toggle;
            }

        }, interval * 1000.0);
    }, delay * 1000.0);

    el.clearBlink = (opacity) => {

        clearTimeout(el.blinkDelay);
        clearInterval(el.blink);

        if (opacity !== undefined)
            el.style.opacity = opacity;
    };
};