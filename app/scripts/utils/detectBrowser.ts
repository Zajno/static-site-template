import { detect } from 'detect-browser';

// Here's why why shouldn't use this script:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent

const browser = detect();

const version = browser?.version?.split('.', 1);

const target = document.body;
target?.classList.add(
    'browser-' + (browser?.name || '?'),
    'browser-version-' + (version || '?'),
);
