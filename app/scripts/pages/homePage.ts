import 'styles/home.sass';

import Section, { SectionCtor } from '../core/section';
import CommonPage from './commonPage';

export default class HomePage extends CommonPage {
    _sectionTypes: SectionCtor[] = [
        Section,
    ];

    async setupPageAsync() {
        super.setupPageAsync();
        //
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}
HomePage.RunPage(HomePage);
