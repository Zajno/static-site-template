
/** @typedef {import('core/page').default} Page */

/** @typedef {new (id: string) => Page} PageType */
/** @typedef {{ [pageId: string]: (() => Promise<PageType>) }} PagesMap */

/** @type {PagesMap} */
let theMap = { };

/** @arg {PagesMap} pagesMap */
function initialize(pagesMap) {
    theMap = pagesMap;
}

async function getPageTypeAsync(pageId) {

    const loader = theMap[pageId];
    const type = loader && await loader();

    return type;
}

export {
    initialize,
    getPageTypeAsync,
};
