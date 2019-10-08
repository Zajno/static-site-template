export default ({ el, delay = 0.0, count, interval }) => {
    if (el.clearScramble) {
        el.clearScramble();
    }

    const text = el.textContent;
    const parts = text.split('');

    el.scrambleDelay = setTimeout(() => {

        let currentCount = 0;

        el.scramble = setInterval(() => {

            if (currentCount++ >= count) {
                el.clearScramble();
            } else {
                el.textContent = parts.sort(() => 0.5 - Math.random()).join('');
            }

        }, interval * 1000.0);
    }, delay * 1000.0);

    el.clearScramble = () => {
        el.textContent = text;
        clearTimeout(el.scrambleDelay);
        clearInterval(el.scramble);
    };
};
