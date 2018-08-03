import Section from 'core/section';
import CommonPage from './commonPage';

const defaultOptions = {
    sectionsNumber: 1,

    header: true,
    imagesLazyLoad: true,
    videoModals: false,
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

        get enableHeader() { return opts.header; }

        get enabledImagesLazyLoad() {
            return opts.imagesLazyLoad;
        }

        get enableVideoModals() {
            return opts.videoModals;
        }
    };
}
