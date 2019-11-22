export type TextCounterConfig = {
    el: HTMLElement,
    delay: number,
    duration: number,
};

export default ({ el, delay = 0.0, duration }: TextCounterConfig) => {
    const bel = el as HTMLElement & {
        clearCounter: () => void,
        counterDelay: NodeJS.Timeout,
    };

    if (bel.clearCounter) {
        bel.clearCounter();
    }

    const number = +el.textContent;
    if (Number.isNaN(number)) {
        return;
    }

    if (number <= 0) {
        return;
    }

    let cancel = false;
    const durationMs = duration * 1000.0;
    bel.textContent = '0';

    bel.counterDelay = setTimeout(() => {

        const start = performance.now();

        const doUpdate = timestamp => {

            if (cancel) {
                return;
            }

            const elapsed = timestamp - start;

            let progress = elapsed / durationMs;
            if (progress < 0) {
                progress = 0.0;
            } else if (progress > 1) {
                progress = 1.0;
                cancel = true;
            }

            const value = Math.ceil(number * progress);
            el.textContent = value + '';

            if (!cancel) {
                window.requestAnimationFrame(doUpdate);
            }
        };

        doUpdate(start);

    }, delay * 1000.0);

    bel.clearCounter = () => {
        cancel = true;
        el.textContent = number + '';
        clearTimeout(bel.counterDelay);
    };
};
