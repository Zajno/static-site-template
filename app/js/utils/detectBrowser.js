import logger from 'logger';
import { detect }  from 'detect-browser';

export const browser = detect();

export default function DetectBrowser() {

    const version = browser.version.split('.', 1);
    document.getElementById('main').classList.add(`browser-${browser.name}`);
    document.getElementById('main').classList.add(`browser-version-${version}`);
}
