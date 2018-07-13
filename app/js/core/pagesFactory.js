
async function getDefaultPage(options) {
    const module = await import(/* webpackChunkName: "default" */ 'pages/defaultPage');
    const factory = module.default;

    const type = factory(options);
    return type;
}

/** @returns {Promise} */
async function getPageTypeAsync(pageId) {

    switch (pageId) {
        case 'HOME': {
            // const module = await import(/* webpackChunkName: "home" */ 'pages/homePage');
            // return module.default;
            const type = await getDefaultPage({
                sectionsNumber: 1,
            });
            return type;
        }

        default: {
            throw new Error('invalid page ID');
        }
    }
}

export default {
    getPageTypeAsync,
};
