import logger from 'logger';

// core
// import Pages from 'core/pages';
import PagesFactory from 'core/pagesFactory';

/**
 * @typedef {import('core/section').default} Section
 * @typedef {import('core/page').default} Page
 */

export default class App {

    // SETUP -------------------------------------------------------------------

    constructor() {
        // DOM
        this._root;

        // page
        this._pageID;
        this._page;

        this._activeSectionIndex = -1;

        // window

        this._width = 0.0;
        this._height = 0.0;
        this._centerY = 0.0;

        this._scrollPosition = 0.0;
        this._scrollDirection = -1.0;

        this._initialized = false;
        this._started = false;
    }

    async setupAsync() {
        if (this._initialized) {
            return;
        }

        // store main div
        this._root = document.getElementById('main');

        if (!this._root)
            throw new Error('app.js -- No div with ID "main" found.');

        // store page ID
        this._pageID = (this._root.dataset.pageId || '').toUpperCase();
        const PageType = await PagesFactory.getPageTypeAsync(this._pageID);

        /** @type {Page} */
        this._page = new PageType(this._pageID);
        await this._page.setupAsync(this._root);

        this._initialized = true;

        this.start();
    }

    // WINDOW ------------------------------------------------------------------

    resize() {
        if (!this._initialized) {
            return;
        }
        // logger.log('App.resize()');

        this._width = document.body.clientWidth;
        this._height = window.innerHeight;
        this._centerY = this._height * 0.5;

        this._page.resize(this._width, this._height);

        this.scroll();
    }

    scroll() {
        if (!this._initialized) {
            return;
        }

        // logger.log('App.scroll()');

        const scrollPosition = window.pageYOffset;

        this._scrollDirection = (scrollPosition > this._scrollPosition) ? -1.0 : 1.0;
        this._scrollPosition = scrollPosition;

        this._page.scroll(this._scrollDirection, this._scrollPosition);
    }

    // STATE -------------------------------------------------------------------

    start() {
        if (!this._initialized || this._started) {
            return;
        }

        this._started = true;
        this.resize();
    }

    // UPDATE ------------------------------------------------------------------

    update() {
        // logger.log('App.update()');
    }
}
