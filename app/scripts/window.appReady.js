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

w.appReady = function (cb) {
    if (cb) {
        if (ild) {
            cb();
        } else {
            cbs.push(cb);
        }
    }
};

w.appReady.addErrorHandler = function (cb) {
    ercbs.push(cb);
};

// require this module for fallback purposes;
// if the code above was not added to the head, it can be imported in JS entry for preventing app from crashing
