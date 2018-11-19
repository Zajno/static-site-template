const pages = require('./pages');

const hostname = process.env.HOST ||  process.env.HOSTNAME || 'http://localhost';

const pagesFlatten = [];

pages.forEach(page => {

    pagesFlatten.push({
        ...page,
        output: `${page.fileName || page.id}.html`,
    });
});

const result = {
    pages,
    pagesFlatten,
    hostname,
};

module.exports = result;
