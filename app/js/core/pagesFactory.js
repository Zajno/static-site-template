let theMap = { };

function initialize(pagesMap) {
    theMap = pagesMap;
}

/** @returns {Promise} */
async function getPageTypeAsync(pageId) {

    const loader = theMap[pageId];
    const type = loader && await loader();

    return type;
}

export default {
    initialize,
    getPageTypeAsync,
};
