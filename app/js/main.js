import 'polyfills';
import logger from 'logger';

import '../styles/main.sass';

import './pages';
import App from 'core/app';

const _app = new App();

function _resize()  {
    _app.resize();
}

function _scroll() {
    _app.scroll();
}

function _update() {
    _app.update();
    window.requestAnimationFrame(_update);
}

function _initialize() {
    window.onresize = _resize;
    window.onscroll = _scroll;

    logger.log('[MAIN] Initialize');

    _app.start();
    // window.appReady(() => {
    //     logger.log('[MAIN] Ready');

        // disabled - not needed for now
        // window.requestAnimationFrame(_update);
    // });
}

_app.setupAsync()
    .then(_initialize)
    .catch(err => console.error('[MAIN] Failed initialize APP:', err));
