import 'styles/base.sass';
import 'styles/home.sass';

import Section, { SectionCtor } from 'app/core/section';
import CommonPage from './commonPage';

export default class Page404 extends CommonPage {
    _sectionTypes: SectionCtor[] = [
        Section,
    ];

    get sectionTypes() {
        return this._sectionTypes;
    }
}

Page404.RunPage(Page404);
