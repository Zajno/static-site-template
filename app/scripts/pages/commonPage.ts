import 'styles/base.sass';

import Page from 'app/core/page';
import Breakpoints from 'app/appBreakpoints';

export default abstract class CommonPage extends Page {

    start() {
        super.start();

        window.appReady(() => {
            // add some logic on page loaded here
        });
    }

    resize() {
        super.resize();
        Breakpoints.resize(this.width, this.height);
    }

    // async setupPageAsync() {
    //     super.setupPageAsync();
    // }

    // scroll(scrollDirection, scrollPosition) {
    //     super.scroll(scrollDirection, scrollPosition);
    // }

}
