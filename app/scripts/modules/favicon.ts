const DARK = '(prefers-color-scheme: dark)';
const LIGHT = '(prefers-color-scheme: light)';

const icons = document.head.querySelectorAll('link[rel="icon"]');
const shortcutIcons = document.head.querySelectorAll('link[rel="shortcut icon"]');
const appleTouchIcons = document.head.querySelectorAll('link[rel="apple-touch-icon"]');
const safariPinnedTab = document.head.querySelectorAll('link[rel="mask-icon"]');

const favicons = [...icons, ...shortcutIcons, ...appleTouchIcons, ...safariPinnedTab] as HTMLLinkElement[];

function changeWebsiteTheme(scheme: string) {
    // const path = `${window.location.origin}/assets/img/${scheme || ''}-`;
    // if (!scheme) {
    //     scheme = '';
    //     path = `${window.location.origin}/assets/img/`;
    // }
    // console.log('icon path: ', path);

    favicons.forEach(icon => {
        if (icon.href) {
            // icon.href = icon.href.replace(`${window.location.origin}/assets/img/`, path);
            if (icon.href.indexOf('black')) {
                icon.href = icon.href.replace('black', scheme);
            }
            if (icon.href.indexOf('white')) {
                icon.href = icon.href.replace('white', scheme);
            }
        }
    });
}

export default function detectColorScheme() {
    if (!window.matchMedia) {
        return;
    }
    function listener({ matches, media }) {
        if (!matches) {
            return;
        }
        if (media === DARK) {
            changeWebsiteTheme('black');
        } else if (media === LIGHT) {
            changeWebsiteTheme('white');
        }
    }
    const mqDark = window.matchMedia(DARK);
    mqDark.addListener(listener);
    const mqLight = window.matchMedia(LIGHT);
    mqLight.addListener(listener);

    if (mqDark.matches) {
        changeWebsiteTheme('black');
    } else if (mqLight.matches) {
        changeWebsiteTheme('white');
    }
}
