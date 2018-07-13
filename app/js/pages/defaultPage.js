import ensureScripts from 'modules/ensureSripts';

import Section from 'core/section';
import CommonPage from './commonPage';

const defaultOptions = {
    sectionsNumber: 1,

    videosReplace: false,
    stickyHeader: true,
    imagesLazyLoad: true,
    mobileMenu: true,

    modules: {
        bodymovin: false,
    },
};

export default function CreateDefaultPage(options) {
    const opts = Object.assign({}, defaultOptions, options);

    return class DefaultPage extends CommonPage {
        _setup() {
            this._sectionTypes = [];
            for (let i = 0; i < opts.sectionsNumber; ++i) {
                this._sectionTypes.push(Section);
            }

            super._setup();
        }

        get sectionTypes() {
            return this._sectionTypes;
        }

        async _loadModulesAsync() {
            await super._loadModulesAsync();

            if (opts.modules.bodymovin) {
                await ensureScripts.bodymovinAsync();
            }
        }

        get enabledVideosReplace() {
            return opts.videosReplace;
        }

        get enabledStickyHeader() {
            return opts.stickyHeader;
        }

        get enabledImagesLazyLoad() {
            return opts.imagesLazyLoad;
        }

        get enabledMobileMenu() {
            return opts.mobileMenu;
        }

    };
}
