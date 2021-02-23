/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global require */

import { browser, ApplyNameAndVersion } from './detectBrowser';

const testElemId = 'css-variable-test';

console.log('[BrowserCheck]: starting...');

function doesSupport() {
    const elTest = document.getElementById(testElemId);
    if (!elTest) {
        return undefined;
    }

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
        // check for proxy
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const p = new Proxy({}, {});
        // check for symbol
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const s = Symbol('test');
        // check for arrow functions
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const f = () => { /* no-op */ };
    } catch (error) {
        console.log('[BrowserCheck]: ' + error);
        return false;
    }

    console.log('[BrowserCheck]: passed.');
    return true;
}

const result = doesSupport();

if (result == null) {
    console.log('[BrowserCheck]: skipped');
} else if (!result) {

    // HIDE ALL ELEMENTS

    const body = document.querySelector('body');
    const elems = body.querySelectorAll('main, header, footer, #mobile-menu, #preloader');
    elems.forEach(el => {
        el.parentNode.removeChild(el);
    });

    // PLACE NOT SUPPORTED BROWSER PLACEHOLDER

    const ieMain = document.createElement('main');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    import('app/modules/iePlaceholder')
        .then(module => {
            body.style.cursor = 'default';
            ieMain.innerHTML = module.default;
            // makeVisible(ieMain);

            body.insertBefore(ieMain, body.firstChild).classList.add('ie__main');
        });


    throw new Error('The browser is not supported. Follow links on the screen or contact site administrator.');
} else {
    ApplyNameAndVersion();
}
