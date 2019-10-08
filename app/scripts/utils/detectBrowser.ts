import { detect }  from 'detect-browser';

const browser = detect();

function ApplyNameAndVersion(el: HTMLElement = null) {

    if (browser) {
        const version = browser.version.split('.', 1);

        const target = el || document.getElementById('main');
        if (target) {
            target.classList.add('browser-' + browser.name);
            target.classList.add('browser-version-' + version);
        }

        return true;
    }

    return false;
}

export {
    browser,
    ApplyNameAndVersion,
};