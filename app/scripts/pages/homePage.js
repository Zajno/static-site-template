import 'styles/home.sass';

import CommonPage from 'pages/commonPage';
import Section from 'core/section';

export default class HomePage extends CommonPage {
    _setup() {
        this._sectionTypes = [
            Section,
        ];

        super._setup();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }
}
