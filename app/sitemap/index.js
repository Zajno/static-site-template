const pages = require('./pages');

/** @typedef {pages.SitePage} SitePage */

const hostname = process.env.HOST ||  process.env.HOSTNAME || 'http://localhost';

/** @type {(SitePage & { output: string })[]} */
const pagesFlatten = [];

pages.forEach(page => {
    let path;

    if (page.outputFileName) {
        path = page.outputFileName;
    } else {
        path = `${page.id}/index.html`;
    }

    pagesFlatten.push({
        ...page,
        output: path,
    });
});

const result = {
    pages,
    pagesFlatten,
    hostname,
};

module.exports = result;
