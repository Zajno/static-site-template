
/**
 * @typedef {Object} SitePage
 * @property {string} id will be used as `{id}/index.html` for output file name unless `outputFileName` was set up
 * @property {string} templateName
 * @property {string=} outputFileName 'index.html' or 'pageName/index.html'
 * @property {string} title
 * @property {string} description
 * @property {string} cannonical
 * @property {string} image
 * @property {{ [sectionName: string ]: SiteSection}} sections
*/

/** @typedef {any} SiteSection TODO */

const hostname = process.env.HOST || process.env.HOSTNAME || 'http://localhost';

/** @type {SitePage} */
const Home = {
    id: 'home',
    templateName: 'app/html/index.ejs',
    outputFileName: 'index.html',
    title: 'Zajno | Digital Design Agency',
    description: 'Full-service digital design and development agency specializing in UX/UI design, crafting thought-out personalized experiences for web and mobile.',
    cannonical: hostname,
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
