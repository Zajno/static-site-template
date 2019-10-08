import { detect }  from 'detect-browser';

const browser = detect();

function ApplyNameAndVersion() {

    if (browser) {
        const version = browser.version.split('.', 1);
        document.getElementById('main').classList.add('browser-' + browser.name);
        document.getElementById('main').classList.add('browser-version-' + version);
        return true;
    }

    return false;
}

export { browser, ApplyNameAndVersion };