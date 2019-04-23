const pages = require('./pages');

const hostname = process.env.HOST ||  process.env.HOSTNAME || 'http://localhost';

const pagesFlatten = [];

pages.forEach(page => {
    let path;

    if (page.pathName) {
        path = page.pathName;
    } else {
        path = `${page.fileName || page.id}/index.html`;
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
