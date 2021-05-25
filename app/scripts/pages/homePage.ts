// import styles in the correct order:
import 'styles/base.sass';
import 'styles/home';

import { SectionCtor } from 'app/core/section';
import CommonPage from './commonPage';

import HeroSection from 'app/sections/HeroSection';
import TabSection from 'app/sections/TabsSection';

export default class HomePage extends CommonPage {
    _sectionTypes: SectionCtor[] = [
        HeroSection,
        TabSection,
    ];

    async setupPageAsync() {
        await super.setupPageAsync();
    }

    get sectionTypes() {
        return this._sectionTypes;
    }

}

HomePage.RunPage(HomePage);
