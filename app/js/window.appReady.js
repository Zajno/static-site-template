// window.appReady – Analog for window.onload event,
//  but can be correctly subscribed and fired even after actual window.load
// Usage: minify/polyfill this (https://babeljs.io/en/repl), wrap with <script> and place to your <head>.

let ild = false;
let cbs = [];
const w = window;

w.addEventListener('load', function () {
    ild = true;
    cbs.forEach(function (cb) {
        try {
            cb();
        } catch (err) {
            // no-op
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
