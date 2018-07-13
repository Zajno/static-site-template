import '../sass/main.sass';

import 'polyfills';

import App from 'core/app';

const _app = new App();

_app.setupAsync();


// WINDOW ----------------------------------------------------------------------

const _resize = () => {
    _app.resize();
};

const _scroll = () => {
    _app.scroll();
};

// SETUP -----------------------------------------------------------------------

window.onload = () => {

    window.onresize = _resize;
    window.onscroll = _scroll;

    // window.requestAnimationFrame(_update);
    _app.start();
};

// UPDATE ----------------------------------------------------------------------

const _update = () => {
    _app.update();
    window.requestAnimationFrame(_update);
};
