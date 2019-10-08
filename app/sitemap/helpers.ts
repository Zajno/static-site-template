
function linkifyText(text: string) {

}

function a(text: string, href: string, classes: string[] = []) {
    return `<a href="${href}" target="_blank" rel="noopener" class="${classes.join(' ')}" >${text}</a>`;
}

function span(text: string, classes: string[] = []) {
    return `<span class="${classes.join(' ')}" >${text}</span>`;
}

function p(text: string, classes: string[] = []) {
    return `<p class="desc-1 ${classes.join(' ')}" >${text}</p>`;
}

export {
    a,
    span,
    p,
};
