
function load(url: string, cb: (result: string) => any) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        cb(this.responseText);
    };
    xhr.open('GET', url);
    xhr.send();
}

const body = document.querySelector('body');
const elems = body.querySelectorAll('main, header, footer, #mobile-menu, #preloader');
elems.forEach(el => {
    el.parentNode.removeChild(el);
});

body.style.cursor = 'default';

// LOAD AND PLACE NOT SUPPORTED BROWSER PLACEHOLDER
const ieMain = document.createElement('main');
body.insertBefore(ieMain, body.firstChild).classList.add('ie__main');

load('/not-supported', (htmlContent) => {
    ieMain.innerHTML = htmlContent;
    throw new Error('The browser is not supported. Follow links on the screen or contact site administrator.');
});
