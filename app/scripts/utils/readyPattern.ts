
export default function addReadyEvent(target: EventTarget) {

    let isLoaded = false;
    let isOk: boolean;
    const listeners = [];

    const onFinish = ok => {
        isLoaded = true;
        isOk = ok;
        listeners.forEach(cb => {
            try {
                cb(ok);
            } catch (err) {
                // no-op
            }
        });
        listeners.length = 0;
    };

    target.addEventListener('load', () => onFinish(true));
    target.addEventListener('error', () => onFinish(false));

    return function onReady(cb) {
        if (isLoaded) {
            try {
                cb(isOk);
            } catch (err) {
                // no-op
            }
        } else {
            listeners.push(cb);
        }
    };
}
