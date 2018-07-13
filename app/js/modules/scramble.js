export default ({ el, text, delay = 0.0, count, interval }) =>
{
    if (el.clearScramble)
        el.clearScramble();

    el.scrambleDelay = setTimeout(() => {

        let currentCount = 0;

        el.scramble = setInterval(() => {

            if (currentCount++ === count) {

                el.textContent = text;
                clearInterval(el.scramble);

            } else {

                el.textContent = text.split('').sort(() => 0.5 - Math.random()).join('');
            }

        }, interval * 1000.0);
    }, delay * 1000.0);

    el.clearScramble = () => {

        clearTimeout(el.scrambleDelay);
        clearInterval(el.scramble);
    };
};