
/** @typedef {Object} SitePage
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} cannonical
 * @property {string} image
*/

const hostname = process.env.HOST || process.env.HOSTNAME || 'http://localhost';

const Home = {
    id: 'home',
    fileName: 'index',
    title: 'Home',
    description: 'Home description',
    cannonical: hostname,
    templateName: 'app/html/index.html',
    image: hostname + '',
    sections: {
        Hero: {
        },
    },
};

/** @type {SitePage[]} */
const pages = [
    Home,
];

module.exports = pages;
