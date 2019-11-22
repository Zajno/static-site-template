export type BlinkConfig = {
    el: HTMLElement,
    delay: number,
    count: number,
    interval: number,
    on: number,
    off: number,
    final: number,
    onComplete: () => void,
};

export default ({ el, delay = 0.0, count, interval, on, off, final, onComplete }: BlinkConfig) => {
    let toggle = false;

    const bel = el as HTMLElement & {
        clearBlink?: () => void,
        blinkDelay?: NodeJS.Timeout,
        blink?: NodeJS.Timeout,
    };

    if (bel.clearBlink) {
        bel.clearBlink();
    }

    bel.blinkDelay = setTimeout(() => {

        let currentCount = 0;

        bel.blink = setInterval(() => {

            if (currentCount++ === count) {

                bel.style.opacity = final + '';
                clearInterval(bel.blink);

                if (onComplete) {
                    onComplete();
                }
            } else {

                bel.style.opacity = (toggle ? on : off) + '';
                toggle = !toggle;
            }

        }, interval * 1000.0);
    }, delay * 1000.0);

    bel.clearBlink = (opacity?: number) => {

        clearTimeout(bel.blinkDelay);
        clearInterval(bel.blink);

        if (opacity !== undefined)
            el.style.opacity = opacity + '';
    };
};