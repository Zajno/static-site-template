import 'styles/home.sass';

import Section, { SectionCtor } from '../core/section';
import CommonPage from './commonPage';
import HeroSection from 'app/sections/HeroSection';

export default class HomePage extends CommonPage {
    _sectionTypes: SectionCtor[] = [
        HeroSection,
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
