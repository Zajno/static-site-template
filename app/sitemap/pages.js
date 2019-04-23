
/**
 * @typedef {Object} SitePage
 * @property {string} id
 * @property {string} pathName
 * @property {string=} fileName
 * @property {string} title
 * @property {string} description
 * @property {string} cannonical
 * @property {string} image
*/

const hostname = process.env.HOST || process.env.HOSTNAME || 'http://localhost';

const Home = {
    id: 'home',
    pathName: 'index.html',
    title: 'Zajno | Digital Design Agency',
    description: 'Full-service digital design and development agency specializing in UX/UI design, crafting thought-out personalized experiences for web and mobile.',
    cannonical: hostname,
    templateName: 'app/html/index.ejs',
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
