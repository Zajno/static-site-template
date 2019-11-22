import 'styles/home.sass';

import Section, { SectionCtor } from '../core/section';
import CommonPage from './commonPage';
import HeroSection from 'app/sections/HeroSection';
import TabSection from 'app/sections/TabsSections';

export default class HomePage extends CommonPage {
    _sectionTypes: SectionCtor[] = [
        HeroSection,
        TabSection,
    ];

    async setupPageAsync() {
        super.setupPageAsync();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}
HomePage.RunPage(HomePage);
