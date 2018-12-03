
/**
 *
 * @param {string} text
 * @returns {string}
 */
function linkifyText(text) {

}

function a(text, href, classes = []) {
    return `<a href="${href}" target="_blank" rel="noopener" class="${classes.join(' ')}" >${text}</a>`;
}

function span(text, classes = []) {
    return `<span class="${classes.join(' ')}" >${text}</span>`;
}

function p(text, classes = []) {
    return `<p class="desc-1 ${classes.join(' ')}" >${text}</p>`;
}

module.exports = {
    a,
    span,
    p,
};
