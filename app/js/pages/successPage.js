import logger from 'logger';

import CommonPage from 'pages/commonPage';
import Section from 'core/section';

import { getUrlVarsV2 } from 'utils/getUrlQueryVariables';

/** @typedef {{title:string,message:string,route:string,routeText:string}} SuccessMessage */

/** @type {Object.<string,SuccessMessage>} */
const Presets = {
};

export default class SuccessPage extends CommonPage {
    _setup() {
        this._sectionTypes = [
            Section,
        ];

        this._args = getUrlVarsV2();


        this._useHeader = this._args.header != null;
        this._preset = Presets[this._args.preset];

        logger.log('SuccessPage args:', window.location.search, this._args, this._preset);

        super._setup();

        this._title = this._root.querySelector('h1#title');
        this._message = this._root.querySelector('p#message');
        /** @type {HTMLAnchorElement} */
        this._anchor = this._root.querySelector('a#route');

        if (this._preset) {
            this._title.innerHTML = this._preset.title;
            this._message.innerHTML = this._preset.message;
            this._anchor.href = this._preset.route;
            this._anchor.innerHTML = this._preset.routeText;
        }
    }

    get sectionTypes() { return this._sectionTypes; }

    get enableHeader() { return this._useHeader; }

    get enabledVideosReplace() { return false; }

    get enabledImagesLazyLoad() { return false; }

    get enableVideoModals() { return false; }
}
