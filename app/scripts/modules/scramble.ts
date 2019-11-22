export type ScramleConfig = {
    el: HTMLElement,
    delay: number,
    count: number,
    interval: number,
};

export default ({ el, delay = 0.0, count, interval }: ScramleConfig) => {
    const bel = el as HTMLElement & {
        clearScramble: () => void,
        scrambleDelay: NodeJS.Timeout,
        scramble: NodeJS.Timeout,
    };

    if (bel.clearScramble) {
        bel.clearScramble();
    }

    const text = el.textContent;
    const parts = text.split('');

    bel.scrambleDelay = setTimeout(() => {

        let currentCount = 0;

        bel.scramble = setInterval(() => {

            if (currentCount++ >= count) {
                bel.clearScramble();
            } else {
                bel.textContent = parts.sort(() => 0.5 - Math.random()).join('');
            }

        }, interval * 1000.0);
    }, delay * 1000.0);

    bel.clearScramble = () => {
        el.textContent = text;
        clearTimeout(bel.scrambleDelay);
        clearInterval(bel.scramble);
    };
};
