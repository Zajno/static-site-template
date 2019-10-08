import { URL } from 'url';

let Hostname = process.env.HOSTNAME || 'http://localhost/';

if (Hostname.endsWith('/')) {
    Hostname = Hostname.substring(0, Hostname.length - 1);
}

console.log('[Hostname] Current Hostname =', Hostname);

function combine(path: string, base: string) {
    return new URL(path, base).href;
}

function combineWithHostname(path: string) {
    return combine(path, Hostname);
};

export {
    Hostname,

    combine,
    combineWithHostname,
};
