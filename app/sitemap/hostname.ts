/* eslint-disable no-console */

import { URL } from 'url';
import { CurrentConfig } from '../config';

export let Hostname = CurrentConfig.Hostname || 'http://localhost/';

if (Hostname.endsWith('/')) {
    Hostname = Hostname.substring(0, Hostname.length - 1);
}

console.log('[Hostname] Current Hostname =', Hostname);

export function combineUrl(path: string, base: string) {
    return new URL(path, base).href;
}

export function combineUrlWithHostname(path: string) {
    return combineUrl(path, Hostname);
}
