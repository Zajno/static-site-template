import logger from 'logger';

/** @typedef {import('core/section').default}  Section */

export default class Page {
    constructor(id) {
        this._id = id;
        /** @type {HTMLElement} */
        this._root = null;

        /** @type {Section[]} */
        this._sections = [];

        this._width = 0;
        this._height = 0;

        this._defineSectionHelpersMethods();
    }

    async setupAsync(root) {
        this._root = root;

        await this._loadModulesAsync();

        this._setup();
    }

    _loadModulesAsync() {
        return Promise.resolve();
    }

    _setup() {
        this._setupSections(this._root.querySelectorAll('section'));
    }

    /** @abstract
     * @return {Class[]}
    */
    get sectionTypes() {
        throw new Error('abstract');
    }

    _setupSections(sections) {
        this._sections = [];
        const types = this.sectionTypes;

        sections.forEach((section, i) => {
            const Type = types[i];
            if (!Type) {
                return;
            }

            const instance = new Type({ element: section });
            this._sections.push(instance);
        });

        // this._activeSectionIndex = 0;
        // this._activeSection = this._sections[0];

        logger.log(`Sections (${this._sections.length}):`, this._sections);
    }

    /**
     * @param {number} scrollDirection
     * @param {number} scrollPosition
     */
    scroll(scrollDirection, scrollPosition) {
        this._scrollDirection = scrollDirection;
        this._scrollPosition = scrollPosition;

        this._updateSections();
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        let yPos = 0.0;
        // console.clear();

        this._sections.forEach((section) => {
            section.resize(this._width, this._height, yPos);
            // logger.log(yPos, section.height, section);

            yPos += section.height;

        });
    }

    _defineSectionHelpersMethods() {
        this._getIsShowDown = (top, bottom, showTreshold) => top <= this._height - showTreshold;
        this._getIsHideDown = (top, bottom, hideTreshold) => bottom <= hideTreshold;
        this._getIsShowUp = (top, bottom, showTreshold) => bottom >= showTreshold;
        this._getIsHideUp = (top, bottom, hideTreshold) => top > this._height - hideTreshold;
    }

    _updateSections() {
        let coeffsDirection;
        let getIsShow;
        let getIsHide;

        if (this._scrollDirection <= 0) {
            coeffsDirection = 'down';
            getIsShow = this._getIsShowDown;
            getIsHide = this._getIsHideDown;
        } else {
            coeffsDirection = 'up';
            getIsShow = this._getIsShowUp;
            getIsHide = this._getIsHideUp;
        }

        const sectionsNum = this._sections.length;
        for (let i = 0; i < sectionsNum; i++) {
            /** @type {Section} */
            const section = this._sections[i];
            const sHeight = section.height;

            const top = section.y - this._scrollPosition;
            const bottom = top + sHeight;

            const coeffs = section.scrollCoeffs[coeffsDirection];

            let show = null;

            let showTreshold = this._height * coeffs.show;
            if (sHeight < showTreshold)
                showTreshold = sHeight * 0.5;

            // show if top of next element is in range
            if (getIsShow(top, bottom, showTreshold)) {
                show = true;
            }

            let hideTreshold = this._height * coeffs.hide;
            if (sHeight < hideTreshold) {
                hideTreshold = sHeight * 0.5;
            }

            if (getIsHide(top, bottom, hideTreshold)) {
                show = false;
            }

            this._updateSectionActivation(show, section);
        }
    }

    _updateSectionActivation(show, section) {
        if (show != null) {
            if (show) {
                section.activate(0.0, this._scrollDirection);
            } else {
                section.deactivate(0.0, this._scrollDirection);
            }
        }
    }
}
