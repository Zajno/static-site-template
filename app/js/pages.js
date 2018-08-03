import pagesFactory from 'core/pagesFactory';

import commonBundle from './pages.bundle.common';

async function getPagesBundle1() {
    const module = await import(/* webpackChunkName: "pages1" */ './pages.bundle1');
    return module.default;
}

function getDefaultPage(options) {
    // const bundle1 = await getPagesBundle1();
    return Promise.resolve(commonBundle.CreateDefaultPage(options));
}

const pages = {
    HOME: async () => (await getPagesBundle1()).homePage,
};

pagesFactory.initialize(pages);
