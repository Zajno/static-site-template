export default ({ el, delay = 0.0, duration }) => {
    if (el.clearCounter) {
        el.clearCounter();
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
    el.textContent = '0';

    el.counterDelay = setTimeout(() => {

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
            el.textContent = value;

            if (!cancel) {
                window.requestAnimationFrame(doUpdate);
            }
        };

        doUpdate(start);

    }, delay * 1000.0);

    el.clearCounter = () => {
        cancel = true;
        el.textContent = number;
        clearTimeout(el.counterDelay);
    };
};
