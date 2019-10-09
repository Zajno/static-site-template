import 'styles/home.sass';

import Section, { SectionCtor } from '../core/section';
import CommonPage from './commonPage';

export default class HomePage extends CommonPage {
    _sectionTypes: SectionCtor[];
    async setupPageAsync() {
        super.setupPageAsync();
        this._sectionTypes = [
            Section,
        ];
        console.log('setup', this._sectionTypes);
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}
HomePage.RunPage(HomePage);
