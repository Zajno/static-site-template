import logger from 'app/logger';

declare global {
    export function appReady(cb: () => any): void;
    export namespace appReady {
        export function addErrorHandler(cb: (err: any) => void): void;
    }
}

function init() {
    // window.appReady – Analog for window.onload event,
    //  but can be correctly subscribed and fired even after actual window.load
    // Usage: minify/polyfill this (https://babeljs.io/en/repl), wrap with <script> and place to your <head>.

    let ild = false;
    let cbs = [];
    const w = window;
    const ercbs = [];

    w.addEventListener('load', function () {
        ild = true;
        cbs.forEach(function (cb) {
            try {
                cb();
            } catch (err) {
                ercbs.forEach(c => c(err));
            }
        });
        cbs = null;
    });

    if (w.appReady) {
        w.appReady = function (cb) {
            if (cb) {
                if (ild) {
                    cb();
                } else {
                    cbs.push(cb);
                }
            }
        } as typeof window.appReady;
    }

    if (!w.appReady.addErrorHandler) {
        w.appReady.addErrorHandler = function (cb) {
            ercbs.push(cb);
        };
    }

    // require this module for fallback purposes;
    // if the code above was not added to the head, it can be imported in JS entry for preventing app from crashing
}

if (!window.appReady) {
    logger.error('[MAIN] window.appReady is not set up. Will be used fallback version, but proper functioning not guranteed.');
    init();
}

window.appReady.addErrorHandler(err => {
    logger.error('[MAIN][AppReady] ERROR:', err);
});
