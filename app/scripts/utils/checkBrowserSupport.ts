/* eslint-disable no-console */
/* global require */

import { browser, ApplyNameAndVersion } from './detectBrowser';

function isSupported() {
    console.log('[BrowserCheck]: starting...', browser.type, browser.name, browser.version, browser.os);

    if (!(window as any).supportsCssVars) {
        console.warn('[BrowserCheck] CSS vars check did not pass');
        return false;
    }

    console.log('[BrowserCheck]: passed.');
    return true;
}

const result = isSupported();

if (result == null) {
    console.log('[BrowserCheck]: skipped');
} else if (!result) {
    require('./loadNotSupported');
} else {
    ApplyNameAndVersion();
}
