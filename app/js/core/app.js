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
        this._deltaY = 0.0;

        this._scrollPosition = 0.0;
        this._scrollDirection = -1.0;
    }

    async setupAsync() {
        // store main div
        this._root = document.getElementById('main');

        if (!this._root)
            throw new Error('[APP] No div with ID "main" found.');

        // store page ID
        this._pageID = (this._root.dataset.pageId || '').toUpperCase();

        const PageType = await PagesFactory.getPageTypeAsync(this._pageID);
        if (!PageType) {
            throw new Error(`[APP] Faied to initialize page. ID = ${this._pageID}`);
        }

        /** @type {Page} */
        this._page = new PageType(this._pageID);
        await this._page.setupAsync(this._root);

        logger.log('[APP] Page ID =', this._pageID, this._page);
    }

    // WINDOW ------------------------------------------------------------------

    resize() {
        this._width = document.body.clientWidth;
        this._height = window.innerHeight;
        this._centerY = this._height * 0.5;

        this._page.resize(this._width, this._height);

        this.scroll();
    }

    scroll() {
        const scrollPosition = window.pageYOffset;

        if (this._scrollPosition === scrollPosition) {
            this._scrollDirection = 0.0;
        } else {
            this._scrollDirection = scrollPosition > this._scrollPosition
                ? -1.0
                : 1.0;
        }
        this._scrollPosition = scrollPosition;

        this._page.scroll(this._scrollDirection, this._scrollPosition);
    }

    wheel(e) {
        this._deltaY = e.deltaY ? e.deltaY : e.originalEvent && e.originalEvent.detail;
        this._wheelDirection = this._deltaY > 0 ? 'down' : 'up';

        this._page.wheel(this._deltaY, this._wheelDirection);
    }

    // STATE -------------------------------------------------------------------

    start() {
        this._page.start();
        this.resize();
    }

    // UPDATE ------------------------------------------------------------------

    update() {
        // logger.log('App.update()');
    }
}
