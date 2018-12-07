import 'styles/base.sass';

import logger from 'logger';
import Page from 'app/core/page';
import Breakpoints from 'app/appBreakpoints';

export default class CommonPage extends Page {

    _setup() {
        super._setup();
    }

    start() {
        super.start();

        window.appReady(() => {
            // add some logic on page loaded here
        });
    }

    resize(width, height) {
        Breakpoints.resize(width, height)

        super.resize(width, height);
    }

    // scroll(scrollDirection, scrollPosition) {
    //     super.scroll(scrollDirection, scrollPosition);
    // }

}
