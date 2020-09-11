
export function setTimeoutAsync(ms: number, useCancel: (cb: () => void) => void  = null) {
    let canceled = false;
    let _reject: () => void;
    const res = new Promise<void>((resolve, reject) => {
        _reject = reject;
        setTimeout(() => {
            _reject = null;
            if (!canceled) {
                resolve();
            }
        }, ms);
    });

    if (useCancel) {
        const cancelCb = () => {
            canceled = true;
            if (_reject) {
                _reject();
            }
        };
        useCancel(cancelCb);
    }

    return res;
}

export function setTimeoutFramesAsync(frames: number) {
    return new Promise(resolve => {
        let left = frames || 0;

        const cb = () => {
            if (--left <= 0) {
                resolve();
            } else {
                requestAnimationFrame(cb);
            }
        };

        cb();
    });
}
