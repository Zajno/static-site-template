// import 'app/polyfills';
import 'app/utils/checkBrowserSupport';

// import logger from 'logger';

// import './pages';
// import App from 'core/app';

// if (!window.appReady) {
//     logger.error('[MAIN] window.appReady is not set up. Will be used fallback version, but proper functioning not guranteed.');
//     require('./window.appReady');
// }

// window.appReady.addErrorHandler(err => {
//     logger.error('[MAIN][AppReady] ERROR:', err);
// });

// const _app = new App();

// function _resize()  {
//     _app.resize();
// }

// function _scroll() {
//     _app.scroll();
// }

// function _update() {
//     _app.update();
//     window.requestAnimationFrame(_update);
// }

// function _mouseWheel(e) {
//     _app.wheel(e);
// }

// function _initialize() {
//     window.onresize = _resize;
//     window.onscroll = _scroll;

//     document.addEventListener('wheel', _mouseWheel);

//     logger.log('[MAIN] Initialize');

//     _app.start();
// }

// _app.setupAsync()
//     .then(_initialize)
//     .catch(err => console.error('[MAIN] Failed initialize APP:', err));
