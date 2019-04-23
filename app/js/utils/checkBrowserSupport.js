
import { browser } from './detectBrowser';

const testElemId = 'css-variable-test';

console.log('[BrowserCheck]: starting...');

function doesSupport() {
    const elTest = document.getElementById(testElemId);
    const computedStyle = window.getComputedStyle(elTest, null);
    console.log('Browser name: ' + browser.name);

    if (computedStyle.opacity !== '1') {
        // eslint-disable-next-line prefer-template
        console.warn('[BrowserCheck] CSS vars check did not pass, value is \'' + computedStyle.opacity + '\', but expected \'1\'.');
        return false;
    }

    if (!browser) {
        console.warn('[BrowserCheck] Failed to detect browser.');
        return false;
    }

    if (browser.name === 'ie') {
        console.warn('[BrowserCheck] Browser is explicitly unsupported: \'' + browser.name + '\'.');
        return false;
    }

    try {
        // chech for proxy
        const p = new Proxy({}, {});
        // check for symbol
        const s = Symbol('test');
        // check for arrow functions
        const f = () => {};
    } catch (error) {
        console.log('[BrowserCheck]: ' + error);
        return false;
    }

    console.log('[BrowserCheck]: passed.');
    return true;
}

if (!doesSupport()) {

    const body = document.querySelector('body');
    const elems = body.querySelectorAll('main, header, footer, #mobile-menu, #preloader');
    elems.forEach(el => {
        el.parentNode.removeChild(el);
    });
    const ieMain = document.createElement('main');
    const ieScreen = require('app/modules/iePlaceholder').default;

    body.style.cursor = 'default';
    ieMain.innerHTML = ieScreen;
    // makeVisible(ieMain);

    body.insertBefore(ieMain, body.firstChild).classList.add('ie__main');

    throw new Error('The browser is not supported. Follow links on the screen or contact site administrator.');
}
